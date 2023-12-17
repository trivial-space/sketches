use std::f32::consts::PI;

use noise::{NoiseFn, Simplex};
use tvs_libs::geometry::line_2d::buffered_geometry::{LineBufferedGeometryVec, LineGeometryProps};
use tvs_libs::geometry::line_2d::Line;
use tvs_libs::prelude::*;
use wasm_bindgen::prelude::*;

fn make_curve(width: f32, p1: Vec2, p2: Vec2, reverse: bool) -> Vec<Vec2> {
    let line = p2 - p1;
    let normal = if reverse {
        vec2(-line.y, line.x).normalize()
    } else {
        vec2(line.y, -line.x).normalize()
    };
    let p3 = p1 + line * 0.5 + normal * (random::<f32>() * 0.3 * width);
    (1..=10)
        .map(|t| {
            let t = t as f32 * 0.1;
            Vec2::quadratic_bezier(t, p1, p3, p2)
        })
        .collect()
}

#[wasm_bindgen]
pub fn get_geom(width: f32, height: f32, steps: usize) -> JsValue {
    let noise = Simplex::new(0);

    let step = height / steps as f32;
    let start = vec2(-width / 2.0, -height / 2.0);
    let end = vec2(width / 2.0, -height / 2.0 + step / 2.0);

    let seed_x = random::<f64>() * 20.0;
    let seed_y = random::<f64>() * 20.0;

    let delta_x = |i: usize| width * 0.24 * noise.get([i as f64, seed_x]) as f32;
    let delta_y = |i: usize| step * 2.0 * noise.get([i as f64, seed_y]) as f32;

    let mut points = Vec::new();

    for i in 0..steps {
        points.push(make_curve(
            width,
            start + vec2(delta_x(i), step * i as f32 + delta_y(i)),
            end + vec2(
                delta_x(i + steps as usize),
                step * i as f32 + delta_y(i + steps as usize),
            ),
            false,
        ));
        points.push(make_curve(
            width,
            end + vec2(
                delta_x(i + steps as usize),
                step * i as f32 + delta_y(i + steps as usize),
            ),
            start + vec2(delta_x(i + 1), step * (i + 1) as f32 + delta_y(i + 1)),
            true,
        ));
    }

    points.push(make_curve(
        width,
        start + vec2(delta_x(steps as usize), height + delta_y(steps as usize)),
        end + vec2(
            delta_x(steps as usize + steps as usize),
            height + delta_y(steps as usize + steps as usize),
        ),
        false,
    ));

    let points = points.concat();

    let mut line = Line::new(height / (steps as f32) * 0.5);
    for p in points {
        line.add(p);
    }

    let lines = line.split_at_angle(PI * 3.0 / 4.0);

    serde_wasm_bindgen::to_value(&lines.to_buffered_geometry_with(LineGeometryProps {
        smouth_depth: 4,
        smouth_angle_threshold: 0.001,
        smouth_min_length: 5.0,
        ..default()
    }))
    .unwrap()
}
