use tvs_libs::{
    prelude::*,
    rendering::{
        camera::{CamProps, PerspectiveCamera},
        scene::SceneObject,
    },
};

pub struct Object {
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

#[derive(AppState)]
pub struct State {
    pub object: Object,
    pub camera: PerspectiveCamera,
}

impl Default for State {
    fn default() -> Self {
        let camera = PerspectiveCamera::create(CamProps {
            fov: Some(0.8),
            translation: Some(vec3(0.0, 1.5, 25.0)),
            ..default()
        });

        let object = Object {
            transform: Transform::from_translation(vec3(0.0, 0.0, 0.0)),
        };

        let s = Self { object, camera };

        s
    }
}

impl State {
    pub fn update(&mut self, _tpf: f32) {}
}
