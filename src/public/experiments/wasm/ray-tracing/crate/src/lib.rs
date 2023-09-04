use js_sys::Uint8Array;
use render::render_ray;
use tvs_libs::{
    prelude::*,
    rendering::{
        objects::{intersection_ray_sphere, Sphere},
        texture::{rgba_f32_to_u8, rgba_u8_to_buffer},
    },
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
    let sphere = Sphere {
        center: vec3(0.0, 0.0, -1.0),
        radius: 0.5,
    };

    let data = rgba_u8_to_buffer(rgba_f32_to_u8(render_ray(width, height, |r| {
        let hit_shpere = intersection_ray_sphere(&r, &sphere);
        if hit_shpere > 0.0 {
            let color = ((r.at(hit_shpere) - sphere.center).normalize() + 1.0) * 0.5;
            return rgba(color);
        }

        let a = 0.5 * (r.direction.y + 1.0);
        let color = vec3(1.0, 1.0, 1.0).lerp(vec3(0.5, 0.7, 1.0), a);

        rgba(color)
    })));

    let arr = Uint8Array::new_with_length((width * height * 4) as u32);
    arr.copy_from(&data);
    arr
}

fn rgba(v: Vec3) -> [f32; 4] {
    [v.x, v.y, v.z, 1.0]
}
