use std::f32::consts::{PI, TAU};

use tvs_libs::{
    prelude::*,
    rendering::{
        camera::{CamProps, PerspectiveCamera},
        scene::SceneObject,
    },
};

pub struct Object {
    pub color: Vec3,
    pub transform: Transform,
    neg_rotation: bool,
    rotation_speed: f32,
}

impl SceneObject for Object {
    fn transform(&self) -> &Transform {
        &self.transform
    }
    fn parent(&self) -> Option<&Self> {
        None
    }
}

pub struct Light {
    pub color: Vec3,
    pub transform: Transform,
    pub texcoords_projection: Mat4,
    pub cam_projection: Mat4,
}

#[derive(AppState)]
pub struct State {
    pub objects: Vec<Object>,
    pub camera: PerspectiveCamera,
    pub light: Light,
    glass_indices: [[usize; 19]; 6],
    texcoord_transform: Mat4,
    light_projection: Mat4,
}

impl Default for State {
    fn default() -> Self {
        let camera = PerspectiveCamera::create(CamProps {
            fov: Some(0.8),
            translation: Some(vec3(0.0, 1.5, 25.0)),
            ..default()
        });

        let texcoord_transform: Mat4 = Transform::from_translation(vec3(0.5, 0.5, 0.5))
            .with_scale(vec3(0.5, 0.5, 0.5))
            .compute_matrix();

        let light_projection: Mat4 = Mat4::perspective_rh(PI / 4.5, 2.0, 0.1, 1000.0);

        let light_transform =
            Transform::from_translation(vec3(0.0, 7.0, 20.0)).looking_at(Vec3::ZERO, Vec3::Y);

        let cam_projection = light_projection * light_transform.compute_matrix().inverse();
        let light = Light {
            transform: light_transform,
            color: vec3(1.0, 1.0, 1.0),
            texcoords_projection: texcoord_transform * cam_projection,
            cam_projection,
        };

        let mut s = Self {
            objects: Vec::new(),
            glass_indices: create_glass_indices(),
            camera,
            light,
            light_projection,
            texcoord_transform,
        };

        let grid_rows = [3, 4, 5, 4, 3];
        let distance_x = 5.0;
        let distance_z = f32::sin(PI / 3.0) * distance_x;
        let top = -distance_z * (grid_rows.len() as f32 - 1.0) / 2.0;

        grid_rows
            .iter()
            .enumerate()
            .for_each(|(row_count, col_count)| {
                let width = distance_x * (*col_count as f32 - 1.0);
                let left = -width / 2.0;

                for i in 0..*col_count {
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
                        neg_rotation: random::<bool>(),
                        rotation_speed: random::<f32>(),
                    });
                }
            });

        s
    }
}

impl State {
    pub fn get_glass_indices(&self, horizontal_angle: f32) -> &[usize; 19] {
        let dir = (horizontal_angle / (PI / 3.0)).round() as usize;
        &self.glass_indices[dir % 6]
    }

    pub fn update(&mut self, tpf: f32) {
        for obj in self.objects.iter_mut() {
            obj.transform.rotate(Quat::from_rotation_y(
                0.0001 * tpf * obj.rotation_speed * (if obj.neg_rotation { -1.0 } else { 1.0 }),
            ));
        }
        self.light.transform =
            Transform::from_rotation(Quat::from_rotation_y(0.00002 * tpf)) * self.light.transform;
        self.light.transform.look_at(vec3(0.0, 0.0, 0.0), Vec3::Y);

        self.light.cam_projection =
            self.light_projection * self.light.transform.compute_matrix().inverse();
        self.light.texcoords_projection = self.texcoord_transform * self.light.cam_projection;
    }
}

fn create_glass_indices() -> [[usize; 19]; 6] {
    let dir_0: [usize; 19] = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
    ];

    let dir_1: [usize; 19] = [
        0, 3, 7, 1, 4, 8, 12, 2, 5, 9, 13, 16, 6, 10, 14, 17, 11, 15, 18,
    ];

    let dir_5: [usize; 19] = [
        2, 6, 11, 1, 5, 10, 15, 0, 4, 9, 14, 18, 3, 8, 13, 17, 7, 12, 16,
    ];

    let mut dir_3: [usize; 19] = dir_0.clone();
    dir_3.reverse();

    let mut dir_4: [usize; 19] = dir_1.clone();
    dir_4.reverse();

    let mut dir_2: [usize; 19] = dir_5.clone();
    dir_2.reverse();

    [dir_0, dir_1, dir_2, dir_3, dir_4, dir_5]
}
