use std::f32::consts::PI;

use geom::{create_glass, create_ground};
use serde::Serialize;
use state::State;
use tvs_libs::{
    prelude::*,
    rendering::{
        buffered_geometry::BufferedGeometry,
        scene::{normal_mat, SceneObject},
    },
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
struct Light {
    color: Vec3,
    dir: Vec3,
    pos: Vec3,
    texcoord_projection: Mat4,
    cam_projection: Mat4,
}

#[derive(Serialize)]
struct BufferedObject {
    color: Vec3,
    model_mat: Mat4,
    normal_mat: Mat3,
}

#[derive(Serialize)]
struct InitData {
    glass_geoms: Vec<BufferedGeometry>,
    ground_geom: BufferedGeometry,
    ground: BufferedObject,
}

#[wasm_bindgen]
pub fn get_init_data() -> JsValue {
    let count = State::read().objects.len();
    let mut data = InitData {
        glass_geoms: Vec::with_capacity(count),
        ground_geom: create_ground(),
        ground: BufferedObject {
            color: vec3(0.5, 0.5, 0.5),
            model_mat: Mat4::IDENTITY,
            normal_mat: normal_mat(Mat4::IDENTITY),
        },
    };

    for _i in 0..count {
        data.glass_geoms.push(create_glass());
    }

    serde_wasm_bindgen::to_value(&data).unwrap()
}

#[derive(Serialize)]
struct FrameData {
    cam_indices: Vec<usize>,
    proj_indices: Vec<usize>,
    objects: Vec<BufferedObject>,
    camera_mat: Mat4,
    camera_pos: Vec3,
    light: Light,
}

#[wasm_bindgen]
pub fn get_angle() -> f32 {
    let s = State::read();
    angle_from_translation(&s.light.transform.translation)
}

fn angle_from_translation(translation: &Vec3) -> f32 {
    let dot = (-translation.xz()).normalize().dot(Vec2::Y);
    let mut light_angle = f32::acos(dot);
    if translation.x < 0.0 {
        light_angle = 2.0 * PI - light_angle;
    }
    3.0 * PI - light_angle
}

#[wasm_bindgen]
pub fn get_frame_data() -> JsValue {
    let s = State::read();
    let cam = &s.camera;
    let objs = &s.objects;
    let light = &s.light;
    let translation = &light.transform.translation;

    let cam_indices = s.get_glass_indices(cam.rot_horizontal);
    let proj_indices = s.get_glass_indices(angle_from_translation(translation));

    let objects = objs
        .iter()
        .map(|o| BufferedObject {
            color: o.color,
            model_mat: o.model_mat(),
            normal_mat: o.model_normal_mat(),
        })
        .collect();

    serde_wasm_bindgen::to_value(&FrameData {
        objects,
        camera_mat: cam.view_proj_mat(),
        camera_pos: cam.translation,
        cam_indices: cam_indices.to_vec(),
        proj_indices: proj_indices.to_vec(),
        light: Light {
            color: light.color,
            dir: light.transform.forward(),
            pos: light.transform.translation,
            texcoord_projection: light.texcoords_projection,
            cam_projection: light.cam_projection,
        },
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
