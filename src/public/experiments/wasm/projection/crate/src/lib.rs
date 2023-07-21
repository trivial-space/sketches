use geom::{create_glass, create_ground};
use js_sys::Float32Array;
use tvs_libs::{
    prelude::*,
    rendering::{
        buffered_geometry::BufferedGeometry,
        camera::{CamProps, PerspectiveCamera},
        scene::{model_normal_mat, model_view_proj_mat},
    },
};
use wasm_bindgen::prelude::*;

mod geom;
mod utils;

pub struct State {
    pub geometries: Vec<BufferedGeometry>,
    pub transforms: Vec<Transform>,
    pub camera: PerspectiveCamera,
    pub light_dir: Vec3,
}

impl Default for State {
    fn default() -> Self {
        let mut s = Self {
            geometries: Vec::new(),
            transforms: Vec::new(),
            camera: PerspectiveCamera::default(),
            light_dir: Vec3::ZERO,
        };

        for i in 0..8 {
            s.geometries.push(create_glass());
            let t = Transform::from_translation(vec3(-8.0 + (i as f32) * 4.0, 0.0, 0.0));
            s.transforms.push(t);
        }

        s.camera.set(CamProps {
            fov: Some(0.8),
            translation: Some(vec3(0.0, 3.0, 20.0)),
            ..default()
        });

        s.light_dir = vec3(1.0, 1.0, 1.0).normalize();

        s
    }
}

impl AppState for State {
    unsafe fn state_cell() -> &'static mut OnceCell<Self> {
        static mut STATE: OnceCell<State> = OnceCell::new();
        &mut STATE
    }
}

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

#[wasm_bindgen]
pub fn get_mvp(i: usize) -> Float32Array {
    let t = State::read().transforms.get(i).unwrap();
    let cam = &State::read().camera;
    mat4_to_js(&model_view_proj_mat(t, cam))
}

#[wasm_bindgen]
pub fn get_normal_mat(i: usize) -> Float32Array {
    let t = State::read().transforms.get(i).unwrap();
    let mat = model_normal_mat(t);
    mat3_to_js(&mat)
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
    State::update(|s| s.camera.update(forward, left, up, rot_y, rot_x))
}

#[wasm_bindgen]
pub fn update(tpf: f32) {
    State::update(|s| {
        for t in s.transforms.iter_mut() {
            t.rotate(Quat::from_rotation_y(0.0003 * tpf));
        }
    });
}
