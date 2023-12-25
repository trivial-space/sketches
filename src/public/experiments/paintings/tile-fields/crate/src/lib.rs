use serde::Serialize;
use std::f32::consts::PI;
use tvs_libs::geometry::line_2d::buffered_geometry::{LineBufferedGeometryVec, LineGeometryProps};
use tvs_libs::geometry::line_2d::Line;
use tvs_libs::prelude::*;
use tvs_libs::rendering::buffered_geometry::BufferedGeometry;
use tvs_libs::utils::f32_utils::fit0111;
use tvs_libs::utils::rand_utils::{rand_int, random_normal_01, Pick};
use wasm_bindgen::prelude::*;

#[derive(Clone, Copy, Serialize)]
struct Color {
    hue: f32,
    lightness: f32,
}

#[derive(Clone, Copy)]
struct Tile {
    top: f32,
    left: f32,
    width: f32,
    height: f32,
    color: Color,
}

fn subdivide_tile<F: Fn() -> Color>(
    tile: Tile,
    min_size: f32,
    max_splits: usize,
    split_variance: f32,
    split_direction_variance: f32,
    get_color: F,
) -> Vec<Tile> {
    if tile.width <= min_size || tile.height <= min_size {
        return vec![tile];
    }

    let divide_horizontally =
        tile.width / tile.height + fit0111(random()) * split_direction_variance > 1.;

    let tile_length = if divide_horizontally {
        tile.width
    } else {
        tile.height
    };

    let tile_count = usize::min(max_splits, (tile_length / min_size).floor() as usize);
    if tile_count < 2 {
        return vec![tile];
    }

    let mut tiles = vec![];

    let mut split_ratios = vec![0.];
    split_ratios.append(
        &mut (1..tile_count)
            .map(|i| (fit0111(random()) * 0.5 * split_variance + i as f32) / tile_count as f32)
            .collect(),
    );
    split_ratios.push(1.);

    for ps in split_ratios.windows(2) {
        let l1 = ps[0];
        let l2 = ps[1];
        let start = l1 * tile_length;
        let length = (l2 - l1) * tile_length;
        let new_tile = if divide_horizontally {
            Tile {
                left: start + tile.left,
                width: length,
                top: tile.top,
                height: tile.height,
                color: get_color(),
            }
        } else {
            Tile {
                left: tile.left,
                width: tile.width,
                top: start + tile.top,
                height: length,
                color: get_color(),
            }
        };
        tiles.push(new_tile);
    }

    tiles
}

#[derive(AppState, Default)]
struct State {
    tiles: Vec<Tile>,
    brush_size: f32,
}

fn random_split(v: Vec<f32>) -> Vec<f32> {
    let idx = rand_int(v.len() - 1);
    let item_i = v[idx];
    let item_ii = v[idx + 1];

    let mut res = vec![];
    for i in 0..=idx {
        res.push(v[i]);
        res.push(item_i.lerp(item_ii, random::<f32>()));
    }
    for i in (idx + 1)..v.len() {
        res.push(v[i]);
    }

    res
}

#[wasm_bindgen]
pub fn setup(width: f32, height: f32, color_count: u8) {
    let mut hues: Vec<f32> = vec![0., 1.];
    for _ in 0..color_count - 1 {
        hues = random_split(hues);
    }
    hues.pop();

    let hue_shift = random::<f32>();
    let colors = hues
        .into_iter()
        .map(|h| {
            let hue = h + hue_shift;
            Color {
                hue: hue - hue.floor(),
                lightness: random_normal_01(),
            }
        })
        .collect::<Vec<_>>();

    let get_color = || colors.pick().clone();

    let brush_size = height / 50.0;

    let first_tile = Tile {
        top: 0.,
        left: 0.,
        width,
        height,
        color: get_color(),
    };

    let mut tiles = vec![first_tile];

    for _ in 0..(rand_int(6) + 1) {
        let mut new_tiles = vec![];
        for tile in tiles {
            new_tiles.append(&mut subdivide_tile(tile, 100., 2, 0.5, 0.5, get_color));
        }
        tiles = new_tiles;
    }

    State::mutate(|s| {
        s.tiles = tiles.clone();
        s.brush_size = brush_size;
    });
}

fn make_curve(width: f32, p1: Vec2, p2: Vec2, reverse: bool) -> Vec<Vec2> {
    let line = p2 - p1;
    let normal = if reverse {
        vec2(-line.y, line.x).normalize()
    } else {
        vec2(line.y, -line.x).normalize()
    };
    let p3 = p1 + line * 0.5 + normal * (random::<f32>() - 0.35) * 0.2 * width;
    (1..=10)
        .map(|t| {
            let t = t as f32 * 0.1;
            Vec2::quadratic_bezier(t, p1, p3, p2)
        })
        .collect()
}

#[derive(Serialize)]
struct LineGeometry {
    geometries: Vec<Vec<BufferedGeometry>>,
    color: Color,
}

#[wasm_bindgen]
pub fn get_geom() -> JsValue {
    let s = State::read();

    let mut tiles = vec![];

    for tile in s.tiles.iter() {
        let brush_size = f32::max(s.brush_size, tile.height / 10.);
        let steps = ((tile.height * 1.5) / brush_size as f32).floor();
        let step = tile.height / steps;
        let start = vec2(tile.left, tile.top + step);
        let end = vec2(tile.left + tile.width, tile.top + step);

        let delta_x = || tile.width * 0.08 * fit0111(random());
        let delta_y = || step * 0.2 * fit0111(random());

        let mut points = Vec::new();

        if random::<bool>() {
            points.push(start + vec2(delta_x(), delta_y()));
        }
        points.push(end + vec2(delta_x(), delta_y()));

        for i in 1..(steps - 1 as f32) as usize {
            points.push(start + vec2(delta_x(), step * i as f32 + delta_y()));
            points.push(end + vec2(delta_x(), step * i as f32 + delta_y()));
        }

        points.push(start + vec2(delta_x(), tile.height - step + delta_y()));
        if random::<bool>() {
            points.push(end + vec2(delta_x(), tile.height - step + delta_y()));
        }

        let points = points
            .windows(2)
            .enumerate()
            .map(|(i, points)| {
                let p1 = points[0];
                let p2 = points[1];
                make_curve(tile.width, p1, p2, i % 2 != 0)
            })
            .collect::<Vec<_>>()
            .concat();

        let mut l = Line::new(1.0);
        for p in points.clone() {
            l.add(p)
        }
        let line_length = l.line_length();

        let mut line = Line::new(brush_size);
        let mut geoms = vec![];

        for p in points {
            line.add(p);
            let lines = line.split_at_angle(PI * 2.0 / 3.0);
            geoms.push(lines.to_buffered_geometry_with(LineGeometryProps {
                total_length: Some(line_length),
                ..default()
            }));
        }

        tiles.push(LineGeometry {
            geometries: geoms,
            color: tile.color,
        });
    }

    serde_wasm_bindgen::to_value(&tiles).unwrap()
}
