use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use tvs_libs::{
    data_structures::grid::make_grid_from_cols,
    geometry::mesh_geometry_3d::{face_normal, MeshBufferedGeometryType, MeshGeometry, Position3D},
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
fn vert(pos: Vec3) -> Vertex {
    Vertex { pos }
}

fn offset(scale: f32) -> f32 {
    (random::<f32>() - 0.5) * scale
}

pub fn create_object() -> BufferedGeometry {
    let tl = vec3(-8.0, 9.0, 0.0);
    let tr = vec3(8.0, 9.0, 0.0);
    let bl = vec3(-8.0, 0.0, 0.0);
    let br = vec3(8.0, 0.0, 0.0);

    let grid = make_grid_from_cols(vec![vec![tl, tr], vec![bl, br]]).subdivide(8, 15, Lerp::lerp);

    let mut geom = MeshGeometry::new();

    for quad in grid.to_cw_quads() {
        let normal = vec3(
            (random::<f32>() - 0.5) * 0.4,
            (random::<f32>() - 0.5) * 0.4,
            1.0,
        )
        .normalize();
        let rot = Quat::from_rotation_arc(Vec3::Z, normal);
        let offset_scale = 0.1;
        let offset = vec3(
            offset(offset_scale),
            offset(offset_scale),
            offset(offset_scale) + 0.4,
        );

        let center = quad.iter().fold(Vec3::ZERO, |acc, v| acc + *v) / 4.0;

        let front = quad
            .iter()
            .map(|v| rot * (*v - center) + center + offset)
            .rev()
            .map(vert)
            .collect::<Vec<_>>();

        let back = quad.iter().map(|v| vert(*v)).collect::<Vec<_>>();

        geom.add_face4_data(front[0], front[1], front[2], front[3], face_normal(normal));
        geom.add_face4_data(
            back[0],
            back[1],
            back[2],
            back[3],
            face_normal(normal * -1.0),
        );

        geom.add_face4(front[3], front[2], back[1], back[0]);
        geom.add_face4(back[3], back[2], front[1], front[0]);
        geom.add_face4(back[2], back[1], front[2], front[1]);
        geom.add_face4(back[0], back[3], front[0], front[3]);
    }

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::FaceNormals)
}

pub fn create_ground() -> BufferedGeometry {
    let grid = make_grid_from_cols(vec![
        vec![vec3(-200.0, 0.0, 200.0), vec3(-200.0, 0.0, -200.0)],
        vec![vec3(200.0, 0.0, 200.0), vec3(200.0, 0.0, -200.0)],
    ]);
    let grid = grid.subdivide(10, 10, Vec3::lerp);

    let mut geom = MeshGeometry::new();
    geom.add_grid_ccw_quads_data(&grid.map(|v| vert(v.val)), face_normal(vec3(0.0, 1.0, 0.0)));

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormals)
}
