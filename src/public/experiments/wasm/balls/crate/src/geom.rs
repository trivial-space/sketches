use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use std::f32::consts::PI;
use tvs_libs::{
    data_structures::grid::{make_grid_with_coord_ops, CIRCLE_COLS_COORD_OPS},
    geometry::mesh_geometry_3d::{face_data, MeshBufferedGeometryType, MeshGeometry, Position3D},
    prelude::*,
    rendering::buffered_geometry::{
        vert_type, BufferedGeometry, BufferedVertexData, OverrideAttributesWith, VertexFormat,
        VertexType,
    },
};

#[repr(C)]
#[derive(Pod, Zeroable, Clone, Copy, Serialize)]
struct Vertex {
    pos: Vec3,
    color: Vec3,
}
impl BufferedVertexData for Vertex {
    fn vertex_layout() -> Vec<VertexType> {
        vec![
            vert_type("position", VertexFormat::Float32x3),
            vert_type("color", VertexFormat::Float32x3),
        ]
    }
}
impl OverrideAttributesWith for Vertex {
    fn override_with(&self, attribs: &Self) -> Self {
        Vertex {
            color: attribs.color,
            ..*self
        }
    }
}
impl Position3D for Vertex {
    fn position(&self) -> Vec3 {
        self.pos
    }
}

fn vert(pos: Vec3, color: Vec3) -> Vertex {
    Vertex { pos, color }
}

pub fn create_ball1_geom() -> BufferedGeometry {
    let mut grid = make_grid_with_coord_ops(CIRCLE_COLS_COORD_OPS);
    let mut col1 = vec![];
    let mut y = -5.0;
    while y <= 5.0 {
        let x = f32::sqrt(25.0 - y * y);
        col1.push(vec3(x, y, 0.0));
        y += 0.5;
    }
    grid.add_col(col1.clone());

    let stops = 20;
    let angle = (PI * 2.0) / stops as f32;
    for i in 1..stops {
        let q = Quat::from_rotation_y(angle * i as f32);
        let col = col1.iter().map(|pos| q.mul_vec3(*pos)).collect();
        grid.add_col(col)
    }

    let mut geom = MeshGeometry::new();
    for quad in grid.to_ccw_quads() {
        let r: f32 = random();
        let g: f32 = random();
        let b: f32 = random();

        let color = vec3(r, g, b);
        geom.add_face4_data(
            vert(quad[0], color),
            vert(quad[1], color),
            vert(quad[2], color),
            vert(quad[3], color),
            face_data(Vertex {
                pos: Vec3::ZERO,
                color,
            }),
        );
    }

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormalFaceData)
}

#[test]
fn test_ball1() {
    let res = create_ball1_geom();
    print!("{:?}", res);
    assert!(res.buffer.len() > 0);
}
