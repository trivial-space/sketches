use serde::Serialize;
use tvs_libs::prelude::*;
use wasm_bindgen::{prelude::wasm_bindgen, JsValue};

#[derive(Default)]
struct Actor {
    pos: Vec2,
    vel: Vec2,
}

#[derive(AppState, Default)]
struct State {
    gravity_center: Vec2,
    puller: Actor,
    brush: Actor,
    width: f32,
    height: f32,
    time_since_gravity_update: f32,
    time_to_next_gravity_update: f32,
}

const GRAVITY_JUMP_DURATION: f32 = 3.5;
const SPRING_LENGTH: f32 = 200.;

#[wasm_bindgen]
pub fn setup(width: f32, height: f32) {
    State::mutate(|s| {
        s.width = width;
        s.height = height;
        s.gravity_center = vec2(rand_f32() * width, if random() { height } else { 0. });
        s.puller.pos = vec2(width / 2., height / 2.);
        s.brush.pos = vec2(width / 2. + SPRING_LENGTH, height / 2.);
    });
}

#[derive(Serialize)]
struct FrameData {
    gravity_center: Vec2,
    puller_pos: Vec2,
    brush_pos: Vec2,
}

#[wasm_bindgen]
pub fn update(seconds_per_frame: f32) -> JsValue {
    State::mutate(|s| {
        let gravity_time = s.time_since_gravity_update + seconds_per_frame;
        let gravity_height = s.height / 6.;

        if gravity_time > s.time_to_next_gravity_update {
            s.time_since_gravity_update = 0.0;
            s.time_to_next_gravity_update =
                GRAVITY_JUMP_DURATION + random_normal() * GRAVITY_JUMP_DURATION * 0.4;

            s.gravity_center = vec2(
                rand_f32() * s.width / 2. + s.width / 4.,
                if s.gravity_center.y == gravity_height {
                    s.height - gravity_height
                } else {
                    gravity_height
                },
            );
        } else {
            s.time_since_gravity_update = gravity_time;
        }

        let is_top = s.gravity_center.y == gravity_height;

        // attract puller to gravity_center

        let puller_to_gravity = s.gravity_center - s.puller.pos;
        let puller_to_gravity_force = puller_to_gravity * seconds_per_frame * 0.14;

        s.puller.vel *= 0.998;
        s.puller.vel += puller_to_gravity_force.clamp(vec2(-0.08, -0.08), vec2(0.08, 0.08));
        s.puller.pos += s.puller.vel;

        // attract brush to puller

        let brush_to_puller = s.puller.pos - s.brush.pos;
        let brush_to_puller_dist = brush_to_puller.length();
        let brush_to_puller_dir = brush_to_puller / brush_to_puller_dist;
        let brush_to_puller_force =
            brush_to_puller_dir * (brush_to_puller_dist - SPRING_LENGTH) * 1.9;

        s.brush.vel *= 0.985;
        s.brush.vel += brush_to_puller_force;
        // s.brush.vel += if is_top {
        //     vec2(0., 3. * seconds_per_frame)
        // } else {
        //     vec2(0., -3. * seconds_per_frame)
        // };
        s.brush.pos += s.brush.vel * seconds_per_frame;
    });

    let s = State::read();

    serde_wasm_bindgen::to_value(&FrameData {
        gravity_center: s.gravity_center,
        puller_pos: s.puller.pos,
        brush_pos: s.brush.pos,
    })
    .unwrap()
}
