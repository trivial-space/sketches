use js_sys::Uint8Array;
use render::{render_ray, RenderProps};
use scene::{DiffuseMaterial, MetalMaterial, SphereObject};
use tvs_libs::{
    prelude::*,
    rendering::texture::{rgba_f32_to_u8, rgba_u8_to_buffer},
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
    let ground_material = DiffuseMaterial {
        color: vec3(0.5, 0.5, 0.5),
    };
    let center_material = DiffuseMaterial {
        color: vec3(1.0, 0.25, 0.25),
    };
    let left_material = MetalMaterial {
        color: vec3(0.25, 0.25, 1.0),
        roughness: 0.1,
    };
    let right_material = MetalMaterial {
        color: vec3(0.25, 1.0, 0.25),
        roughness: 0.7,
    };
    world.add(SphereObject::new(
        vec3(0.0, 0.0, -2.0),
        0.5,
        &center_material,
    ));
    world.add(SphereObject::new(
        vec3(1.0, 0.0, -2.0),
        0.5,
        &right_material,
    ));
    world.add(SphereObject::new(
        vec3(-1.0, 0.0, -2.0),
        0.5,
        &left_material,
    ));
    world.add(SphereObject::new(
        vec3(0.0, -100.5, -2.0),
        100.0,
        &ground_material,
    ));

    let props = RenderProps {
        width,
        height,
        samples_per_pixel: 100,
        max_ray_bounces: 20,
        focal_length: 1.1,
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
