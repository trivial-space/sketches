use js_sys::Uint8Array;
use render::render_ray;
use tvs_libs::{
    prelude::*,
    rendering::texture::{rgba_f32_to_u8, rgba_u8_to_buffer},
};
use wasm_bindgen::prelude::*;

mod render;
mod utils;

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn render(width: u32, height: u32) -> Uint8Array {
    let data = rgba_u8_to_buffer(rgba_f32_to_u8(render_ray(width, height, |r| {
        let unit_direction = r.direction.normalize();
        let a = 0.5 * (unit_direction.y + 1.0);
        let color = vec3(1.0, 1.0, 1.0).lerp(vec3(0.5, 0.7, 1.0), a);

        [color.x, color.y, color.z, 1.0]
    })));

    let arr = Uint8Array::new_with_length((width * height * 4) as u32);
    arr.copy_from(&data);
    arr
}
