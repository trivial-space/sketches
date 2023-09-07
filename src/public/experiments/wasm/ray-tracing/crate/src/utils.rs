use tvs_libs::prelude::*;

pub fn set_panic_hook() {
    // When the `console_error_panic_hook` feature is enabled, we can call the
    // `set_panic_hook` function at least once during initialization, and then
    // we will get better error messages if our code ever panics.
    //
    // For more details see
    // https://github.com/rustwasm/console_error_panic_hook#readme
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

pub fn random_range(min: f32, max: f32) -> f32 {
    min + (max - min) * random::<f32>()
}

pub fn random_in_unit_sphere() -> Vec3 {
    loop {
        let p = vec3(
            random_range(-1.0, 1.0),
            random_range(-1.0, 1.0),
            random_range(-1.0, 1.0),
        );

        if p.length_squared() < 1.0 {
            return p;
        }
    }
}
