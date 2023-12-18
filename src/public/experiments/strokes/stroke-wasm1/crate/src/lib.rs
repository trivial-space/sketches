use std::f32::consts::PI;

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
    let p3 = p1 + line * 0.5 + normal * (random::<f32>() - 0.25) * 0.35 * width;
    (1..=10)
        .map(|t| {
            let t = t as f32 * 0.1;
            Vec2::quadratic_bezier(t, p1, p3, p2)
        })
        .collect()
}

#[wasm_bindgen]
pub fn get_geom(width: f32, height: f32, steps: usize) -> JsValue {
    let step = height / steps as f32;
    let start = vec2(-width / 1.7, -height / 2.0);
    let end = vec2(width / 1.7, -height / 2.0 + step / 2.0);

    let delta_x = || width * 0.15 * (random::<f32>() * 2. - 1.);
    let delta_y = || step * 0.5 * (random::<f32>() * 2. - 1.);

    let mut points = Vec::new();

    for i in 0..steps {
        points.push(start + vec2(delta_x(), step * i as f32 + delta_y()));
        points.push(end + vec2(delta_x(), step * i as f32 + delta_y()));
    }

    points.push(start + vec2(delta_x(), height + delta_y()));
    points.push(end + vec2(delta_x(), height + delta_y()));

    let points = points
        .windows(2)
        .enumerate()
        .map(|(i, points)| {
            let p1 = points[0];
            let p2 = points[1];
            make_curve(width, p1, p2, i % 2 != 0)
        })
        .collect::<Vec<_>>()
        .concat();

    let mut l = Line::new(1.0);
    for p in points.clone() {
        l.add(p)
    }
    let line_length = l.line_length();

    let mut line = Line::new(height / (steps as f32) * 0.7);
    let mut geoms = vec![];

    for p in points {
        line.add(p);
        let lines = line.split_at_angle(PI * 2.0 / 3.0);
        geoms.push(lines.to_buffered_geometry_with(LineGeometryProps {
            smouth_depth: 4,
            smouth_angle_threshold: 0.001,
            smouth_min_length: 5.0,
            total_length: Some(line_length),
            ..default()
        }))
    }

    serde_wasm_bindgen::to_value(&geoms).unwrap()
}
