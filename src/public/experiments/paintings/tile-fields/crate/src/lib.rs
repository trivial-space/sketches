use serde::Serialize;
use std::f32::consts::PI;
use tvs_libs::geometry::line_2d::buffered_geometry::LineBufferedGeometryVec;
use tvs_libs::geometry::line_2d::Line;
use tvs_libs::prelude::*;
use tvs_libs::rendering::buffered_geometry::BufferedGeometry;
use tvs_libs::utils::f32_utils::fit0111;
use tvs_libs::utils::Pick;
use wasm_bindgen::prelude::*;

#[derive(Clone, Copy)]
struct Tile {
    top: f32,
    left: f32,
    width: f32,
    height: f32,
    hue: f32,
}

fn subdivide_tile<F: Fn() -> f32>(
    tile: Tile,
    min_size: f32,
    max_splits: usize,
    split_variance: f32,
    split_direction_variance: f32,
    get_hue: F,
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

    let tile_count = usize::max(max_splits, (tile_length / min_size).floor() as usize);
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
                hue: get_hue(),
            }
        } else {
            Tile {
                left: tile.left,
                width: tile.width,
                top: start + tile.top,
                height: length,
                hue: get_hue(),
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

const MAX_SPLIT_DEPTH: usize = 4;

#[wasm_bindgen]
pub fn setup(width: f32, height: f32, _color_count: u8) {
    let hue1: f32 = random::<f32>() * 360.;
    let hue2: f32 = hue1 + 120. + random_normal() * 60.;
    let hue3: f32 = hue2 + 60. + random_normal() * 30.;
    let hue4: f32 = hue2 + 120. + random_normal() * 60.;

    let get_hue = || *[hue1, hue2, hue3, hue4].as_slice().pick();

    let brush_size = height / 50.0;

    let first_tile = Tile {
        top: 0.,
        left: 0.,
        width,
        height,
        hue: get_hue(),
    };

    let mut tiles = vec![first_tile];

    for _ in 0..MAX_SPLIT_DEPTH {
        let mut new_tiles = vec![];
        for tile in tiles {
            new_tiles.append(&mut subdivide_tile(tile, 100., 2, 0.5, 0.5, get_hue));
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
    let p3 = p1 + line * 0.5 + normal * (random::<f32>() - 0.25) * 0.35 * width;
    (1..=10)
        .map(|t| {
            let t = t as f32 * 0.1;
            Vec2::quadratic_bezier(t, p1, p3, p2)
        })
        .collect()
}

#[derive(Serialize)]
struct LineGeometry {
    geometries: Vec<BufferedGeometry>,
    hue: f32,
}

#[wasm_bindgen]
pub fn get_geom() -> JsValue {
    let s = State::read();

    let mut geoms = vec![];

    for tile in s.tiles.iter() {
        let steps = (tile.height * 1.5 / s.brush_size as f32).floor();
        let step = tile.height / steps;
        let start = vec2(tile.left, tile.top);
        let end = vec2(tile.left + tile.width, tile.top + tile.height);

        let delta_x = || tile.width * 0.15 * fit0111(random());
        let delta_y = || step * 0.5 * fit0111(random());

        let mut points = Vec::new();

        for i in 0..steps as usize {
            points.push(start + vec2(delta_x(), step * i as f32 + delta_y()));
            points.push(end + vec2(delta_x(), step * i as f32 + delta_y()));
        }

        points.push(start + vec2(delta_x(), tile.height + delta_y()));
        points.push(end + vec2(delta_x(), tile.height + delta_y()));

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

        let mut line = Line::new(s.brush_size);
        for p in points.clone() {
            line.add(p)
        }

        let lines = line.split_at_angle(PI * 2.0 / 3.0);
        geoms.push(LineGeometry {
            geometries: lines.to_buffered_geometry(),
            hue: tile.hue,
        })
    }

    serde_wasm_bindgen::to_value(&geoms).unwrap()
}
