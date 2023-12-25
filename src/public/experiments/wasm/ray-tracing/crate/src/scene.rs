use tvs_libs::{
    prelude::*,
    rendering::objects::{intersect_normalized_ray_sphere_within, Ray, Sphere},
    utils::rand_utils::random_in_unit_sphere,
};

pub trait Material {
    fn scatter(&self, ray: &Ray, hit: &Hit) -> Option<Ray>;
    fn emit(&self) -> Vec3;
}

pub struct DiffuseMaterial {
    pub color: Vec3,
}

impl Material for DiffuseMaterial {
    fn emit(&self) -> Vec3 {
        self.color
    }

    fn scatter(&self, _ray: &Ray, hit: &Hit) -> Option<Ray> {
        let mut scatter_direction = hit.normal + random_in_unit_sphere().normalize();
        scatter_direction = if scatter_direction.length_squared() < 0.000001 {
            hit.normal
        } else {
            scatter_direction.normalize()
        };
        Some(Ray {
            direction: scatter_direction,
            origin: hit.p,
        })
    }
}

pub struct MetalMaterial {
    pub color: Vec3,
    pub roughness: f32,
}

fn reflect(v: Vec3, n: Vec3) -> Vec3 {
    v - (2.0 * v.dot(n)) * n
}

impl Material for MetalMaterial {
    fn scatter(&self, ray: &Ray, hit: &Hit) -> Option<Ray> {
        let reflected = reflect(ray.direction, hit.normal);
        let roughness = self.roughness.clamp(0.0, 1.0);
        let mut scattered_direction = reflected + random_in_unit_sphere().normalize() * roughness;

        scattered_direction = if scattered_direction.length_squared() < 0.000001 {
            reflected
        } else {
            scattered_direction.normalize()
        };

        Some(Ray {
            direction: scattered_direction,
            origin: hit.p,
        })
    }

    fn emit(&self) -> Vec3 {
        self.color
    }
}

pub struct Hit<'a> {
    pub p: Vec3,
    pub normal: Vec3,
    pub t: f32,
    pub front_face: bool,
    pub material: &'a dyn Material,
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

pub struct SphereObject<'a> {
    pub sphere: Sphere,
    pub material: &'a dyn Material,
}

impl<'a> SphereObject<'a> {
    pub fn new(center: Vec3, radius: f32, material: &'a dyn Material) -> Self {
        Self {
            sphere: Sphere { center, radius },
            material,
        }
    }
}

impl Hittable for SphereObject<'_> {
    fn hit(&self, r: &Ray, t_min: f32, t_max: f32) -> Option<Hit> {
        let s = &self.sphere;
        let t = intersect_normalized_ray_sphere_within(r, s, t_min, t_max);

        if t < 0.0 {
            return None;
        }

        let p = r.at(t);
        let normal = (p - s.center) / s.radius;
        let front_face = r.direction.dot(normal) < 0.0;

        Some(Hit {
            p,
            normal: if front_face { normal } else { -normal },
            t,
            front_face,
            material: self.material,
        })
    }
}
