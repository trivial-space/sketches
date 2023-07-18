use geom::create_glass;
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
            fov: Some(0.6),
            translation: Some(vec3(0.0, -3.0, -20.0)),
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
pub fn get_geom() -> JsValue {
    let geoms = &State::read().geometries;
    serde_wasm_bindgen::to_value(geoms).unwrap()
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
    State::update(|s| {
        s.camera.set(CamProps {
            aspect_ratio: Some(width / height),
            ..default()
        })
    })
}

#[wasm_bindgen]
pub fn update_camera(forward: f32, left: f32, up: f32, rot_y: f32, rot_x: f32) {
    State::update(|s| {
        if rot_x != 0.0 || rot_y != 0.0 {
            s.camera.set(CamProps {
                rot_horizontal: Some(s.camera.rot_horizontal + rot_y),
                rot_vertical: Some(s.camera.rot_vertical + rot_x),
                ..default()
            })
        }
        let mut translation = s.camera.translation;
        if up != 0.0 {
            translation += Vec3::Y * up;
        }
        if forward != 0.0 {
            translation += vec3(0.0, 0.0, 0.0) * forward; // TODO: use horizontal rotation
        }
        if left != 0.0 {
            translation += vec3(0.0, 0.0, 0.0) * left; // TODO: use horizontal rotation
        }
        s.camera.translation = translation;
    })
}

#[wasm_bindgen]
pub fn update(tpf: f32) {
    State::update(|s| {
        for t in s.transforms.iter_mut() {
            t.rotate(Quat::from_rotation_y(0.0003 * tpf));
        }
    });
}
