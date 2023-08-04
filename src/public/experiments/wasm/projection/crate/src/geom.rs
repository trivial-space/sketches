use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use tvs_libs::{
    data_structures::grid::make_grid,
    geometry::{
        mesh_geometry_3d::{MeshBufferedGeometryType, MeshGeometry, MeshVertex, Position3D},
        vertex_index::VertIdx3f,
    },
    prelude::*,
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

pub fn create_ground() -> BufferedGeometry {
    let mut grid = make_grid();
    grid.add_col(vec![vec3(-20.0, 0.0, -20.0), vec3(-20.0, 0.0, 20.0)]);
    grid.add_col(vec![vec3(20.0, 0.0, -20.0), vec3(20.0, 0.0, 20.0)]);
    let grid = grid.subdivide(10, 10, Vec3::lerp);
    let mut geom = MeshGeometry::new();
    for quad in grid.to_ccw_quads() {
        geom.add_face4_data(
            vert(quad[0]),
            vert(quad[1]),
            vert(quad[2]),
            vert(quad[3]),
            Some(vec3(0.0, 1.0, 0.0)),
            None,
        );
    }

    geom.generate_face_normals();
    geom.generate_vertex_normals();
    geom.triangulate();

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormalFaceData)
}
