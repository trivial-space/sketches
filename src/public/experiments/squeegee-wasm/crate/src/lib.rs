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
    switch_sides: bool,
    is_top: bool,
    spring_length: f32,
    jump_duration: f32,
}

#[wasm_bindgen]
pub fn setup(width: f32, height: f32) {
    let spring_length = width / 6.;

    State::mutate(|s| {
        s.width = width;
        s.height = height;
        s.gravity_center = vec2(rand_f32() * width, if random() { height } else { 0. });
        s.puller.pos = vec2(width / 2., height / 2.);
        s.brush.pos = vec2(width / 2. + spring_length, height / 2.);
        s.spring_length = spring_length;
        s.jump_duration = height / 1200.;
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
        let time = seconds_per_frame.min(0.05);
        let gravity_time = s.time_since_gravity_update + time;
        let gravity_height = s.height / 4.;

        if gravity_time > s.time_to_next_gravity_update {
            s.time_since_gravity_update = 0.0;
            s.time_to_next_gravity_update =
                s.jump_duration + random_normal() * s.jump_duration * 0.4;

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

        let brush_to_puller = s.puller.pos - s.brush.pos;
        let brush_to_puller_dist = brush_to_puller.length();
        let brush_to_puller_dir = brush_to_puller / brush_to_puller_dist;
        let brush_to_puller_force =
            brush_to_puller_dir * (brush_to_puller_dist - s.spring_length) * 0.3;

        s.brush.vel *= 0.995;
        s.brush.vel += s.brush.vel * 0.0001;
        s.brush.vel += brush_to_puller_force;
        s.brush.pos += s.brush.vel * time;
    });

    let s = State::read();

    serde_wasm_bindgen::to_value(&FrameData {
        gravity_center: s.gravity_center,
        puller_pos: s.puller.pos,
        brush_pos: s.brush.pos,
    })
    .unwrap()
}
