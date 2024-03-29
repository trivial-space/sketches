use std::{f32::consts::PI, vec};

use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use tvs_libs::{
    data_structures::grid::make_grid_from_cols,
    geometry::mesh_geometry_3d::{face_normal, MeshBufferedGeometryType, MeshGeometry, Position3D},
    prelude::*,
    rendering::{
        buffered_geometry::{
            create_buffered_geometry_layout, vert_type, BufferedGeometry, BufferedVertexData,
            NoAttributeOverride, RenderingPrimitive, VertexFormat, VertexType,
        },
        camera::{CamProps, PerspectiveCamera},
    },
    setup_camera_interactions,
};
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[derive(Default)]
struct Actor {
    pos: Vec2,
    vel: Vec2,
}

#[repr(C)]
#[derive(Pod, Copy, Clone, Zeroable)]
struct Particle {
    idx: f32,
    pos: Vec2,
    width: f32,
    length: f32,
    length_offset: f32,
}
impl BufferedVertexData for Particle {
    fn vertex_layout() -> Vec<VertexType> {
        vec![
            vert_type("idx", VertexFormat::Float32),
            vert_type("pos", VertexFormat::Float32x2),
            vert_type("width", VertexFormat::Float32),
            vert_type("length", VertexFormat::Float32),
            vert_type("length_offset", VertexFormat::Float32),
        ]
    }
}

#[derive(AppState, Default)]
struct State {
    width: f32,
    height: f32,
    gravity_center: Vec2,
    time_since_gravity_update: f32,
    next_gravity_update: f32,
    switch_sides: bool,
    is_top: bool,
    spring_length: f32,
    jump_duration: f32,
    puller: Actor,

    brush_center: Actor,
    brush_dir: Vec2,
    brush_width: f32,
    brush_particles: Vec<Particle>,

    camera: PerspectiveCamera,
    light: Transform,
}

const PARTICLE_COUNT: usize = 20;

#[wasm_bindgen]
pub fn setup(width: f32, height: f32) {
    let spring_length = width / 6.;
    let brush_width = width.min(height) / 3.5;

    State::mutate(|s| {
        s.width = width;
        s.height = height;
        s.gravity_center = vec2(rand_f32() * width, if random() { height } else { 0. });
        s.puller.pos = vec2(width / 2., height / 2.);
        s.brush_center.pos = vec2(width / 2., height / 2. + spring_length);
        s.spring_length = spring_length;
        s.jump_duration = 2.5;
        s.brush_width = brush_width;
        s.brush_dir = vec2(0., -1.);

        let brush_direction = (s.brush_center.pos - s.puller.pos).normalize();
        let brush_normal = vec2(-brush_direction.y, brush_direction.x);
        s.brush_particles = (0..PARTICLE_COUNT)
            .map(|i| {
                let idx = i as f32 / PARTICLE_COUNT as f32;
                let scale = (idx - 0.5) * brush_width;
                Particle {
                    idx,
                    pos: s.brush_center.pos + brush_normal * scale,
                    width: rand_f32() * brush_width / 6. + brush_width * 0.1,
                    length: 0.,
                    length_offset: 0.,
                }
            })
            .collect();

        s.camera = PerspectiveCamera::create(CamProps {
            fov: Some(0.8),
            near: Some(1.),
            far: Some(10000.),
            translation: Some(vec3(0.0, 400.5, 500.0)),
            ..default()
        });

        s.light =
            Transform::from_translation(vec3(0., 3., 20.)).looking_at(vec3(0., 3., 0.), Vec3::Y);
    });
}

// === init data ===

#[repr(C)]
#[derive(Pod, Zeroable, Clone, Copy, Serialize)]
struct Vertex {
    pos: Vec3,
    uv: Vec2,
}
impl BufferedVertexData for Vertex {
    fn vertex_layout() -> Vec<VertexType> {
        vec![
            vert_type("position", VertexFormat::Float32x3),
            vert_type("uv", VertexFormat::Float32x2),
        ]
    }
}
impl NoAttributeOverride for Vertex {}
impl Position3D for Vertex {
    fn position(&self) -> Vec3 {
        self.pos
    }
}
impl Lerp<f32> for Vertex {
    fn lerp(self, other: Self, t: f32) -> Self {
        Vertex {
            pos: self.pos.lerp(other.pos, t),
            uv: self.uv.lerp(other.uv, t),
        }
    }
}
fn vert(pos: Vec3, uv: Vec2) -> Vertex {
    Vertex { pos, uv }
}

pub fn create_ground(width: f32, height: f32) -> BufferedGeometry {
    let w_half = width / 2.;
    let h_half = height / 2.;
    let grid = make_grid_from_cols(vec![
        vec![
            vert(vec3(-w_half, 0.0, h_half), vec2(0., 0.)),
            vert(vec3(-w_half, 0.0, -h_half), vec2(0., 1.)),
        ],
        vec![
            vert(vec3(w_half, 0.0, h_half), vec2(1., 0.)),
            vert(vec3(w_half, 0.0, -h_half), vec2(1., 1.)),
        ],
    ]);
    let grid = grid.subdivide(w_half as u32 / 2, h_half as u32 / 2);

    let mut geom = MeshGeometry::new();
    geom.add_grid_ccw_quads_data(&grid, face_normal(vec3(0.0, 1.0, 0.0)));

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormals)
}

#[derive(Serialize)]
struct InitData {
    plate_geom: BufferedGeometry,
    // light_pos: Vec3,
    // light_dir: Vec3,
}

#[wasm_bindgen]
pub fn get_init_data() -> JsValue {
    let s = State::read();
    let data = InitData {
        plate_geom: create_ground(s.width, s.height),
        // light_pos: s.light.translation,
        // light_dir: s.light.forward(),
    };

    serde_wasm_bindgen::to_value(&data).unwrap()
}

// === frame data ===

#[derive(Serialize)]
struct FrameData {
    gravity_center: Vec2,
    puller_pos: Vec2,
    brush_pos: Vec2,
    brush_geometry: BufferedGeometry,
    brush_dir: Vec2,

    view_mat: Mat4,
    proj_mat: Mat4,
}

fn rotate_point(point: Vec2, center: Vec2, angle: f32) -> Vec2 {
    let s = angle.sin();
    let c = angle.cos();

    let p = point - center;

    let xnew = p.x * c - p.y * s;
    let ynew = p.x * s + p.y * c;

    vec2(xnew, ynew) + center
}

#[wasm_bindgen]
pub fn update(seconds_per_frame: f32) -> JsValue {
    State::mutate(|s| {
        let time = seconds_per_frame.min(0.05);
        let gravity_time = s.time_since_gravity_update + time;
        let gravity_height = s.height / 4.;

        if gravity_time > s.next_gravity_update {
            s.time_since_gravity_update = 0.0;
            s.next_gravity_update = s.jump_duration + random_normal() * s.jump_duration * 0.4;

            let is_top = s.gravity_center.y == gravity_height;

            s.switch_sides = !s.switch_sides;
            if s.switch_sides {
                s.is_top = is_top;
            }

            s.gravity_center = vec2(
                rand_f32() * s.width / 1.5 + s.width / 6.,
                if s.is_top {
                    s.height - gravity_height
                } else {
                    gravity_height
                },
            );
        } else {
            s.time_since_gravity_update = gravity_time;
        }

        // attract puller to gravity_center

        let puller_to_gravity = s.gravity_center - s.puller.pos;
        let puller_to_gravity_force = puller_to_gravity * time / 190.;

        s.puller.vel *= 0.99;
        s.puller.vel += puller_to_gravity_force; //.clamp(vec2(-0.08, -0.08), vec2(0.08, 0.08));
        s.puller.pos += s.puller.vel;

        // attract brush to puller

        let brush_to_puller = s.puller.pos - s.brush_center.pos;
        let brush_to_puller_dist = brush_to_puller.length();
        let brush_to_puller_dir = brush_to_puller / brush_to_puller_dist;
        let brush_to_puller_force =
            brush_to_puller_dir * (brush_to_puller_dist - s.spring_length) * 0.2;

        let old_center = s.brush_center.pos;

        s.brush_center.vel *= 0.995;
        s.brush_center.vel += s.brush_center.vel * 0.0001;
        s.brush_center.vel += brush_to_puller_force;
        s.brush_center.pos += s.brush_center.vel * time;

        let brush_dist = s.brush_center.pos - old_center;
        let brush_dir = brush_dist.try_normalize();

        if let Some(dir) = brush_dir {
            let mut angle = s.brush_dir.angle_between(dir);
            if angle > PI / 2. {
                angle = angle - PI;
            } else if angle < -PI / 2. {
                angle = PI + angle;
            }

            for p in s.brush_particles.iter_mut() {
                let new_pos = p.pos + brush_dist;
                let new_pos = rotate_point(new_pos, s.brush_center.pos, angle);

                let l = (new_pos - p.pos).length();

                p.pos = new_pos;
                p.length_offset += p.length;
                p.length = l;
            }

            s.brush_dir = dir;
        }
    });

    let s = State::read();

    let layout = create_buffered_geometry_layout(Particle::vertex_layout());

    let geom = BufferedGeometry {
        buffer: bytemuck::cast_slice(&s.brush_particles).to_vec(),
        indices: None,
        rendering_primitive: RenderingPrimitive::Points,
        vertex_count: PARTICLE_COUNT as u32,
        vertex_size: layout.vertex_size,
        vertex_layout: layout.vertex_layout,
    };

    serde_wasm_bindgen::to_value(&FrameData {
        gravity_center: s.gravity_center,
        puller_pos: s.puller.pos,
        brush_pos: s.brush_center.pos,
        brush_geometry: geom,
        brush_dir: s.brush_dir,

        view_mat: s.camera.view_mat(),
        proj_mat: s.camera.projection_mat(),
    })
    .unwrap()
}

setup_camera_interactions!(State, camera);
