use tvs_libs::{
    geometry::line_2d::{buffered_geometry::LineGeometryOpts, Line},
    prelude::*,
};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn get_geom(screen_width: usize, screen_height: usize, point_count: usize) -> JsValue {
    let mut line = Line::new(20.0);

    for _i in 0..point_count {
        line.add_width(
            vec2(
                (random::<f32>() - 0.5) * (screen_width as f32),
                (random::<f32>() - 0.5) * (screen_height as f32),
            ),
            random::<f32>() * 40.0 + 20.0,
        );
    }

    serde_wasm_bindgen::to_value(&line.to_buffered_geometry_with(LineGeometryOpts { ..default() }))
        .unwrap()
}
