use tvs_libs::{
    prelude::*,
    utils::rand_utils::{rand_int, random_normal},
};

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

const GRAVITY_JUMP_DURATION: f32 = 5.5;
const SPRING_LENGTH: f32 = 20.;

pub fn update(seconds_per_frame: f32) {
    State::mutate(|s| {
        let gravity_time = s.time_since_gravity_update + seconds_per_frame;
        if gravity_time > s.time_to_next_gravity_update {
            s.time_since_gravity_update = 0.0;
            s.time_to_next_gravity_update =
                GRAVITY_JUMP_DURATION + random_normal() * GRAVITY_JUMP_DURATION * 0.8;

            let side = rand_int(4);
            s.gravity_center = match side {
                0 => Vec2::new(random::<f32>() * s.width, 0.),
                1 => Vec2::new(random::<f32>() * s.width, s.height),
                2 => Vec2::new(0., random::<f32>() * s.height),
                _ => Vec2::new(s.width, random::<f32>() * s.height),
            };
            Vec2::new(
                random::<f32>() * s.width * 1.5 - s.width * 0.5,
                random::<f32>() * s.height * 1.5 - s.height * 0.5,
            );
        } else {
            s.time_since_gravity_update = gravity_time;
        }

        // attract puller to gravity_center

        let puller_to_gravity = s.gravity_center - s.puller.pos;
        let puller_to_gravity_dist = puller_to_gravity.length();
        let puller_to_gravity_dir = puller_to_gravity / puller_to_gravity_dist;
        let puller_to_gravity_force =
            puller_to_gravity_dir * (puller_to_gravity_dist - SPRING_LENGTH) * 0.1;
        s.puller.vel *= 0.9;
        s.puller.vel += puller_to_gravity_force;
        s.puller.pos += s.puller.vel * seconds_per_frame;

        // attract brush to puller

        let brush_to_puller = s.puller.pos - s.brush.pos;
        let brush_to_puller_dist = brush_to_puller.length();
        let brush_to_puller_dir = brush_to_puller / brush_to_puller_dist;
        let brush_to_puller_force =
            brush_to_puller_dir * (brush_to_puller_dist - SPRING_LENGTH) * 0.1;
        s.brush.vel *= 0.9;
        s.brush.vel += brush_to_puller_force;
        s.brush.pos += s.brush.vel * seconds_per_frame;
    })
}
