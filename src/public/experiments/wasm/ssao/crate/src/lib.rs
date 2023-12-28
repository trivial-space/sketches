use geom::{create_ground, create_object};
use serde::Serialize;
use tvs_libs::{
    prelude::*,
    rendering::{
        buffered_geometry::BufferedGeometry,
        camera::{CamProps, PerspectiveCamera},
        scene::normal_mat,
    },
    setup_camera_interactions,
};
use wasm_bindgen::prelude::*;

mod geom;
mod utils;

#[derive(AppState)]
pub struct State {
    pub camera: PerspectiveCamera,
    pub light: Transform,
}

impl Default for State {
    fn default() -> Self {
        let camera = PerspectiveCamera::create(CamProps {
            fov: Some(0.8),
            translation: Some(vec3(0.0, 1.5, 5.0)),
            ..default()
        });

        let s = Self {
            camera,
            light: Transform::from_translation(vec3(0., 3., 20.))
                .looking_at(vec3(0., 3., 0.), Vec3::Y),
        };

        s
    }
}

#[wasm_bindgen]
pub fn setup() {
    utils::set_panic_hook();
}

#[derive(Serialize)]
struct InitData {
    object_geom: BufferedGeometry,
    ground_geom: BufferedGeometry,
    light_pos: Vec3,
    light_dir: Vec3,
}

#[wasm_bindgen]
pub fn get_init_data() -> JsValue {
    let s = State::read();
    let data = InitData {
        object_geom: create_object(),
        ground_geom: create_ground(),
        light_pos: s.light.translation,
        light_dir: s.light.forward(),
    };

    serde_wasm_bindgen::to_value(&data).unwrap()
}

#[derive(Serialize)]
struct FrameData {
    view_mat: Mat4,
    proj_mat: Mat4,
    view_normal_mat: Mat3,
    light_view_pos: Vec3,
    light_view_dir: Vec3,
}

#[wasm_bindgen]
pub fn get_frame_data() -> JsValue {
    let s = State::read();
    let cam = &s.camera;

    let view_mat = cam.view_mat();
    let view_normal_mat = normal_mat(view_mat);

    serde_wasm_bindgen::to_value(&FrameData {
        view_mat,
        proj_mat: cam.projection_mat(),
        view_normal_mat,
        light_view_pos: view_mat.project_point3(s.light.translation),
        light_view_dir: view_normal_mat.mul_vec3(s.light.forward()),
    })
    .unwrap()
}

setup_camera_interactions!(State, camera);
