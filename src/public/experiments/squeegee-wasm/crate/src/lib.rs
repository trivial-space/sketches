use std::f32::consts::PI;

use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use tvs_libs::{
    prelude::*,
    rendering::buffered_geometry::{
        create_buffered_geometry_layout, vert_type, BufferedGeometry, BufferedVertexData,
        RenderingPrimitive, VertexFormat, VertexType,
    },
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
}

const PARTICLE_COUNT: usize = 20;

#[wasm_bindgen]
pub fn setup(width: f32, height: f32) {
    let spring_length = width / 6.;
    let brush_width = width.min(height) / 5.;

    State::mutate(|s| {
        s.width = width;
        s.height = height;
        s.gravity_center = vec2(rand_f32() * width, if random() { height } else { 0. });
        s.puller.pos = vec2(width / 2., height / 2.);
        s.brush_center.pos = vec2(width / 2., height / 2. + spring_length);
        s.spring_length = spring_length;
        s.jump_duration = height / 1200.;
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
                    width: rand_f32() * brush_width / 3. + brush_width * 0.2,
                    length: 0.,
                    length_offset: 0.,
                }
            })
            .collect();
    });
}

#[derive(Serialize)]
struct FrameData {
    gravity_center: Vec2,
    puller_pos: Vec2,
    brush_pos: Vec2,
    brush_geometry: BufferedGeometry,
    brush_dir: Vec2,
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
        let puller_to_gravity_force = puller_to_gravity * time * s.height / 250000.;

        s.puller.vel *= 0.99;
        s.puller.vel += puller_to_gravity_force; //.clamp(vec2(-0.08, -0.08), vec2(0.08, 0.08));
        s.puller.pos += s.puller.vel;

        // attract brush to puller

        let brush_to_puller = s.puller.pos - s.brush_center.pos;
        let brush_to_puller_dist = brush_to_puller.length();
        let brush_to_puller_dir = brush_to_puller / brush_to_puller_dist;
        let brush_to_puller_force =
            brush_to_puller_dir * (brush_to_puller_dist - s.spring_length) * 0.3;

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
                angle = PI - angle;
            } else if angle < -PI / 2. {
                angle = -PI + angle;
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
    })
    .unwrap()
}
