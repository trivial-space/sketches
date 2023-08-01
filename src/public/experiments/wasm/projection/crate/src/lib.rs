use std::f32::consts::{PI, TAU};

use geom::{create_glass, create_ground};
use js_sys::Float32Array;
use rand::random;
use serde::Serialize;
use tvs_libs::{
    prelude::*,
    rendering::{
        buffered_geometry::BufferedGeometry,
        camera::{CamProps, PerspectiveCamera},
        scene::SceneObject,
    },
};
use wasm_bindgen::prelude::*;

mod geom;
mod utils;

pub struct Object {
    pub color: Vec3,
    pub transform: Transform,
}

impl SceneObject for Object {
    fn transform(&self) -> &Transform {
        &self.transform
    }

    fn parent(&self) -> Option<&Self> {
        None
    }
}

pub struct State {
    pub geometries: Vec<BufferedGeometry>,
    pub objects: Vec<Object>,
    pub camera: PerspectiveCamera,
    pub light_dir: Vec3,
}

impl Default for State {
    fn default() -> Self {
        let mut s = Self {
            geometries: Vec::new(),
            objects: Vec::new(),
            camera: PerspectiveCamera::default(),
            light_dir: Vec3::ZERO,
        };

        // let grid_rows = [4, 5, 6, 7, 6, 5, 4];
        let grid_rows = [3, 4, 5, 4, 3];
        let distance_x = 4.0;
        let distance_z = f32::sin(PI / 3.0) * distance_x;
        let top = -distance_z * grid_rows.len() as f32 / 2.0;

        grid_rows
            .iter()
            .enumerate()
            .for_each(|(row_count, col_count)| {
                let width = distance_x * (*col_count as f32);
                let left = -width / 2.0;

                for i in 0..*col_count {
                    s.geometries.push(create_glass());
                    let c = vec3(random(), random(), random());

                    let mut t = Transform::from_translation(vec3(
                        left + (i as f32) * distance_x + random::<f32>() - 0.5,
                        0.0,
                        top + (row_count as f32) * distance_z + random::<f32>() - 0.5,
                    ));
                    t.rotate_y(TAU * random::<f32>());
                    s.objects.push(Object {
                        color: c,
                        transform: t,
                    });
                }
            });

        s.camera.set(CamProps {
            fov: Some(0.8),
            translation: Some(vec3(0.0, 1.5, 20.0)),
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
    let objs: Vec<BufferedObject> = State::read()
        .objects
        .iter()
        .enumerate()
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
