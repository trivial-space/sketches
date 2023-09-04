use tvs_libs::prelude::*;
use tvs_libs::rendering::objects::Ray;
use tvs_libs::rendering::texture::render_rgba;

pub fn render_ray<F: Fn(Ray) -> [f32; 4]>(width: u32, height: u32, f: F) -> Vec<[f32; 4]> {
    let focal_length = 1.0;
    let origin = vec3(0.0, 0.0, 0.0);
    let aspect_ratio = width as f32 / height as f32;
    let viewport_height = 2.0;
    let viewport_width = aspect_ratio * viewport_height;

    let viewport_u = vec3(viewport_width, 0.0, 0.0);
    let viewport_v = vec3(0.0, -viewport_height, 0.0);

    let pixel_delta_u = viewport_u / width as f32;
    let pixel_delta_v = viewport_v / height as f32;

    let viewport_upper_left =
        origin - viewport_u / 2.0 - viewport_v / 2.0 - vec3(0.0, 0.0, focal_length);

    let pixel00_loc = viewport_upper_left + pixel_delta_u / 2.0 + pixel_delta_v / 2.0;

    render_rgba(width, height, |x, y| {
        let pixel_center = pixel00_loc + pixel_delta_u * x as f32 + pixel_delta_v * y as f32;

        let ray = Ray {
            origin,
            direction: (pixel_center - origin).normalize(),
        };

        f(ray)
    })
}
