use js_sys::Uint8Array;
use render::{render_ray, RenderProps};
use tvs_libs::{
    prelude::*,
    rendering::{
        objects::Sphere,
        texture::{rgba_f32_to_u8, rgba_u8_to_buffer},
    },
};
use wasm_bindgen::prelude::*;

mod render;
mod scene;
mod utils;

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

fn generate_image(width: u32, height: u32) -> Vec<u8> {
    let mut world = scene::HittableList::new();
    world.add(Sphere {
        center: vec3(0.0, 0.0, -1.0),
        radius: 0.5,
    });
    world.add(Sphere {
        center: vec3(1.0, 0.0, -1.0),
        radius: 0.5,
    });
    world.add(Sphere {
        center: vec3(-1.0, 0.0, -1.0),
        radius: 0.5,
    });
    world.add(Sphere {
        center: vec3(0.0, -100.5, -1.0),
        radius: 100.0,
    });

    let props = RenderProps {
        width,
        height,
        samples_per_pixel: 100,
        max_ray_bounces: 20,
        focal_length: 0.9,
        ..default()
    };

    rgba_u8_to_buffer(rgba_f32_to_u8(render_ray(props, world)))
}

#[wasm_bindgen]
pub fn render(width: u32, height: u32) -> Uint8Array {
    let arr = Uint8Array::new_with_length((width * height * 4) as u32);
    let data = generate_image(width, height);
    arr.copy_from(&data);
    arr
}

#[test]
fn test_scene() {
    use std::time::Instant;

    let before = Instant::now();
    generate_image(400, 300);
    let after = Instant::now();
    println!("Time: {:?}", after - before);
}
