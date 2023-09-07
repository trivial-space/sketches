use tvs_libs::prelude::*;
use tvs_libs::rendering::objects::Ray;
use tvs_libs::rendering::texture::render_rgba;

use crate::scene::Hittable;
use crate::utils::random_in_unit_sphere;

pub struct RenderProps {
    pub width: u32,
    pub height: u32,
    pub focal_length: f32,
    pub cam_origin: Vec3,
    pub cam_direction: Vec3,
    pub samples_per_pixel: u32,
    pub max_ray_bounces: u32,
}

impl Default for RenderProps {
    fn default() -> Self {
        Self {
            width: 800,
            height: 600,
            focal_length: 1.0,
            cam_origin: vec3(0.0, 0.0, 0.0),
            cam_direction: vec3(0.0, 0.0, -1.0),
            samples_per_pixel: 10,
            max_ray_bounces: 10,
        }
    }
}

fn ray_color<H: Hittable>(ray: Ray, h: &H, depth: u32) -> Vec3 {
    if depth == 0 {
        return vec3(0.0, 0.0, 0.0);
    }

    if let Some(hit) = h.hit(&ray, 0.001, f32::INFINITY) {
        let direction = (hit.normal + random_in_unit_sphere().normalize()).try_normalize();

        let ray = Ray {
            origin: hit.p,
            direction: direction.unwrap_or(hit.normal),
        };

        return 0.5 * ray_color(ray, h, depth - 1);
    }

    let a = 0.5 * (ray.direction.y + 1.0);
    let color = vec3(1.0, 1.0, 1.0).lerp(vec3(0.5, 0.7, 1.0), a);

    color
}

pub fn render_ray<H: Hittable>(props: RenderProps, h: H) -> Vec<[f32; 4]> {
    let RenderProps {
        width,
        height,
        focal_length,
        max_ray_bounces,
        samples_per_pixel,
        cam_origin: origin,
        ..
    } = props;

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

        let mut color = ray_color(ray, &h, max_ray_bounces);

        if samples_per_pixel > 1 {
            for _ in 1..samples_per_pixel {
                let pixel_center = pixel_center
                    + vec3(
                        (random::<f32>() - 0.5) * pixel_delta_u.x,
                        (random::<f32>() - 0.5) * pixel_delta_v.y,
                        0.0,
                    );
                let ray = Ray {
                    origin,
                    direction: (pixel_center - origin).normalize(),
                };

                color += ray_color(ray, &h, max_ray_bounces);
            }

            color /= samples_per_pixel as f32;
        }

        rgba(color)
    })
}

fn rgba(v: Vec3) -> [f32; 4] {
    [v.x.powf(0.7), v.y.powf(0.7), v.z.powf(0.7), 1.0]
}
