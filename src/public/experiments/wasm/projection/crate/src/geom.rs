use bytemuck::{Pod, Zeroable};
use glam::{vec3, Vec3};
use rand::random;
use serde::Serialize;
use tvs_libs::{
    geometry::{
        mesh_geometry_3d::{MeshBufferedGeometryType, MeshGeometry, MeshVertex, Position3D},
        vertex_index::VertIdx3f,
    },
    rendering::buffered_geometry::{
        vert_type, BufferedGeometry, BufferedVertexData, NoAttributeOverride, VertexFormat,
        VertexType,
    },
};

#[repr(C)]
#[derive(Pod, Zeroable, Clone, Copy, Serialize)]
struct Vertex {
    pos: Vec3,
}
impl BufferedVertexData for Vertex {
    fn vertex_layout() -> Vec<VertexType> {
        vec![vert_type("position", VertexFormat::Float32x3)]
    }
}
impl NoAttributeOverride for Vertex {}
impl Position3D for Vertex {
    fn position(&self) -> Vec3 {
        self.pos
    }
}

fn vert(pos: Vec3) -> MeshVertex<VertIdx3f, Vertex> {
    MeshVertex {
        data: Vertex { pos },
        vertex_index: VertIdx3f(pos.x, pos.y, pos.z),
    }
}

fn offset(scale: f32) -> f32 {
    (random::<f32>() - 0.5) * scale
}

pub fn create_glass() -> BufferedGeometry {
    let mut geom = MeshGeometry::new();
    let tl = vec3(-1.0 + offset(1.5), 4.0 + offset(2.0), 0.0);
    let tr = vec3(1.0 + offset(1.5), 4.0 + offset(2.0), 0.0);
    let bl = vec3(-1.0, 0.0, 0.0);
    let br = vec3(1.0, 0.0, 0.0);
    geom.add_face4(vert(tl), vert(tr), vert(br), vert(bl));

    geom.generate_face_normals();
    geom.generate_vertex_normals();
    geom.triangulate();

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormalFaceData)
}
