use geom::create_ball1_geom;
use js_sys::Float32Array;
use tvs_libs::{
    prelude::*,
    rendering::{
        camera::{CamProps, PerspectiveCamera},
        scene::SceneObject,
    },
};
use wasm_bindgen::prelude::*;
use web_sys::console;

mod geom;
mod utils;

#[derive(Default)]
pub struct State {
    pub ball1: Transform,
    pub cam: PerspectiveCamera,
    pub light_dir: Vec3,
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
    console::log_1(&"Hello, wasm-pack, balls!".into());

    State::update(|s| {
        s.ball1 = Transform::from_translation(vec3(0.0, 0.0, -20.0));
        s.cam.set(CamProps {
            aspect_ratio: Some(4.0 / 3.0),
            fov: Some(0.6),
            ..default()
        });
        s.light_dir = vec3(1.0, 1.0, 1.0).normalize();
    });
}

#[wasm_bindgen]
pub fn get_geom() -> JsValue {
    serde_wasm_bindgen::to_value(&create_ball1_geom()).unwrap()
}

#[wasm_bindgen]
pub fn get_mvp() -> Float32Array {
    let t = &State::read().ball1;
    let cam = &State::read().cam;
    let mat = t.model_view_proj_mat(cam);
    mat4_to_js(&mat)
}

#[wasm_bindgen]
pub fn get_normal_mat() -> Float32Array {
    let t = &State::read().ball1;
    let mat = t.model_normal_mat();
    mat3_to_js(&mat)
}

#[wasm_bindgen]
pub fn get_light() -> Float32Array {
    let v = State::read().light_dir;
    vec3_to_js(&v)
}

#[wasm_bindgen]
pub fn update(tpf: f32) {
    State::update(|s| {
        s.ball1.rotate(Quat::from_rotation_y(0.0003 * tpf));
    });
}
