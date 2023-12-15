use std::f32::consts::PI;

use tvs_libs::{
    geometry::line_2d::{buffered_geometry::LineBufferedGeometryVec, line_vert_w, Line},
    prelude::*,
};
use wasm_bindgen::prelude::*;

fn rand_width() -> f32 {
    random::<f32>() * 280.0 + 20.0
}

#[wasm_bindgen]
pub fn get_geom(screen_width: usize, screen_height: usize, point_count: usize) -> JsValue {
    let mut line = Line::new(20.0);

    for _i in 0..point_count {
        line.add_width(
            vec2(
                (random::<f32>() - 0.5) * (screen_width as f32) * 1.5,
                (random::<f32>() - 0.5) * (screen_height as f32) * 1.5,
            ),
            rand_width(),
        );
    }

    line = line.flat_map_with_prev_next(|curr, _prev, next| {
        if next.is_none() {
            return vec![*curr];
        }

        let n = next.unwrap();

        let pos1 = curr.pos;
        let pos2 = curr.pos.lerp(n.pos, 0.333);
        let pos3 = curr.pos.lerp(n.pos, 0.666);

        return vec![
            line_vert_w(pos1, curr.width),
            line_vert_w(pos2, rand_width()),
            line_vert_w(pos3, rand_width()),
        ];
    });

    line = line.cleanup_vertices(0.5, 0.1, 0.1);

    let lines = line.split_at_angle(PI * 2.0 / 3.0);

    serde_wasm_bindgen::to_value(&lines.to_buffered_geometry()).unwrap()
}
