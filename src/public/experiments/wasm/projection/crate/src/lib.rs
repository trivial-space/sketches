use geom::create_ground;
use js_sys::Float32Array;
use serde::Serialize;
use state::State;
use tvs_libs::{prelude::*, rendering::scene::SceneObject};
use wasm_bindgen::prelude::*;

mod geom;
mod state;
mod utils;

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[wasm_bindgen]
pub fn get_glass_geoms() -> JsValue {
    let geoms = &State::read().geometries;
    serde_wasm_bindgen::to_value(geoms).unwrap()
}

#[wasm_bindgen]
pub fn get_ground_geom() -> JsValue {
    serde_wasm_bindgen::to_value(&create_ground()).unwrap()
}

#[derive(Serialize)]
pub struct BufferedObject {
    pub id: usize,
    pub color: Vec3,
    pub mvp: Mat4,
    pub normal_mat: Mat3,
}
#[wasm_bindgen]
pub fn get_glass_objects() -> JsValue {
    let cam = &State::read().camera;
    let objs = &State::read().objects;
    let indices = &State::read().get_glass_indices(cam.rot_horizontal);

    let objs: Vec<BufferedObject> = indices
        .iter()
        .map(|i| (*i, &objs[*i]))
        .map(|(id, o)| BufferedObject {
            id,
            color: o.color,
            mvp: o.model_view_proj_mat(cam),
            normal_mat: o.model_normal_mat(),
        })
        .collect();
    serde_wasm_bindgen::to_value(&objs).unwrap()
}

#[wasm_bindgen]
pub fn get_cam_mat() -> Float32Array {
    let cam = &State::read().camera;
    mat4_to_js(&cam.view_proj_mat())
}

#[wasm_bindgen]
pub fn get_light() -> Float32Array {
    let v = State::read().light_dir;
    vec3_to_js(&v)
}

#[wasm_bindgen]
pub fn update_screen(width: f32, height: f32) {
    State::update(|s| s.camera.set_aspect_ratio(width / height))
}

#[wasm_bindgen]
pub fn update_camera(forward: f32, left: f32, up: f32, rot_y: f32, rot_x: f32) {
    State::update(|s| s.camera.update_transform(forward, left, up, rot_y, rot_x))
}

#[wasm_bindgen]
pub fn update(tpf: f32) {
    State::update(|s| {
        for obj in s.objects.iter_mut() {
            obj.transform.rotate(Quat::from_rotation_y(0.0001 * tpf));
        }
    });
}
