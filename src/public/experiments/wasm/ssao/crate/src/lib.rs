use geom::{create_ground, create_object};
use serde::Serialize;
use state::State;
use tvs_libs::{
    prelude::*,
    rendering::{buffered_geometry::BufferedGeometry, scene::normal_mat},
};
use wasm_bindgen::prelude::*;

mod geom;
mod state;
mod utils;

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[derive(Serialize)]
struct BufferedObject {
    model_mat: Mat4,
    normal_mat: Mat3,
}

#[derive(Serialize)]
struct InitData {
    object_geom: BufferedGeometry,
    ground_geom: BufferedGeometry,
    ground: BufferedObject,
    object: BufferedObject,
}

#[wasm_bindgen]
pub fn get_init_data() -> JsValue {
    let data = InitData {
        object_geom: create_object(),
        ground_geom: create_ground(),
        ground: BufferedObject {
            model_mat: Mat4::IDENTITY,
            normal_mat: normal_mat(Mat4::IDENTITY),
        },
        object: BufferedObject {
            model_mat: Mat4::IDENTITY,
            normal_mat: normal_mat(Mat4::IDENTITY),
        },
    };

    serde_wasm_bindgen::to_value(&data).unwrap()
}

#[derive(Serialize)]
struct FrameData {
    camera_mat: Mat4,
    camera_pos: Vec3,
}

#[wasm_bindgen]
pub fn get_frame_data() -> JsValue {
    let s = State::read();
    let cam = &s.camera;

    serde_wasm_bindgen::to_value(&FrameData {
        camera_mat: cam.view_proj_mat(),
        camera_pos: cam.translation,
    })
    .unwrap()
}

#[wasm_bindgen]
pub fn update_screen(width: f32, height: f32) {
    State::mutate(|s| s.camera.set_aspect_ratio(width / height))
}

#[wasm_bindgen]
pub fn update_camera(forward: f32, left: f32, up: f32, rot_y: f32, rot_x: f32) {
    State::mutate(|s| s.camera.update_transform(forward, left, up, rot_y, rot_x))
}

#[wasm_bindgen]
pub fn update(tpf: f32) {
    State::mutate(|s| s.update(tpf));
}
