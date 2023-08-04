use geom::{create_glass, create_ground};
use serde::Serialize;
use state::State;
use tvs_libs::{
    prelude::*,
    rendering::{buffered_geometry::BufferedGeometry, scene::SceneObject},
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
}

#[derive(Serialize)]
struct InitData {
    glass_geoms: Vec<BufferedGeometry>,
    ground_geom: BufferedGeometry,
    light: Light,
}

#[wasm_bindgen]
pub fn get_init_data() -> JsValue {
    let count = State::read().objects.len();
    let light = &State::read().light;
    let mut data = InitData {
        glass_geoms: Vec::with_capacity(count),
        ground_geom: create_ground(),
        light: Light {
            color: light.color,
            dir: light.transform.forward(),
            pos: light.transform.translation,
        },
    };

    for _i in 0..count {
        data.glass_geoms.push(create_glass());
    }

    serde_wasm_bindgen::to_value(&data).unwrap()
}

#[derive(Serialize)]
struct BufferedObject {
    id: usize,
    color: Vec3,
    model_mat: Mat4,
    normal_mat: Mat3,
}

#[derive(Serialize)]
struct FrameData {
    objects: Vec<BufferedObject>,
    camera_mat: Mat4,
    camera_pos: Vec3,
}

#[wasm_bindgen]
pub fn get_frame_data() -> JsValue {
    let cam = &State::read().camera;
    let objs = &State::read().objects;
    let indices = &State::read().get_glass_indices(cam.rot_horizontal);

    let objects = indices
        .iter()
        .map(|i| (*i, &objs[*i]))
        .map(|(id, o)| BufferedObject {
            id,
            color: o.color,
            model_mat: o.model_mat(),
            normal_mat: o.model_normal_mat(),
        })
        .collect();

    serde_wasm_bindgen::to_value(&FrameData {
        objects,
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
