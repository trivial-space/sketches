use tvs_libs::{
    prelude::*,
    rendering::objects::{intersect_normalized_ray_sphere_within, Ray, Sphere},
};

pub struct Hit {
    pub p: Vec3,
    pub normal: Vec3,
    pub t: f32,
    pub front_face: bool,
}

pub trait Hittable {
    fn hit(&self, r: &Ray, t_min: f32, t_max: f32) -> Option<Hit>;
}

pub struct HittableList<'a> {
    pub objects: Vec<Box<dyn Hittable + 'a>>,
}

impl<'a> HittableList<'a> {
    pub fn new() -> Self {
        Self {
            objects: Vec::new(),
        }
    }

    pub fn add(&mut self, object: impl Hittable + 'a) {
        self.objects.push(Box::new(object));
    }
}

impl<'a> Hittable for HittableList<'a> {
    fn hit(&self, r: &Ray, t_min: f32, t_max: f32) -> Option<Hit> {
        let mut closest_so_far = t_max;
        let mut hit = None;

        for object in &self.objects {
            if let Some(h) = object.hit(r, t_min, closest_so_far) {
                closest_so_far = h.t;
                hit = Some(h);
            }
        }

        hit
    }
}

impl Hittable for Sphere {
    fn hit(&self, r: &Ray, t_min: f32, t_max: f32) -> Option<Hit> {
        let t = intersect_normalized_ray_sphere_within(r, self, t_min, t_max);

        if t < 0.0 {
            return None;
        }

        let p = r.at(t);
        let normal = (p - self.center) / self.radius;
        let front_face = r.direction.dot(normal) < 0.0;

        Some(Hit {
            p,
            normal: if front_face { normal } else { -normal },
            t,
            front_face,
        })
    }
}
