use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use tvs_libs::{
    data_structures::grid::make_grid,
    geometry::{
        mesh_geometry_3d::{
            face_normal, MeshBufferedGeometryType, MeshGeometry, MeshVertex, Position3D,
        },
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

const GRID_SIZE_Y: usize = 40;
const GRID_SIZE_X: u32 = 25;

pub fn create_glass() -> BufferedGeometry {
    let tl = vec3(-1.0 + offset(1.5), 4.0 + offset(2.0), offset(1.5));
    let tr = vec3(1.0 + offset(1.5), 4.0 + offset(2.0), offset(1.5));
    let bl = vec3(-1.0, 0.0, 0.0);
    let br = vec3(1.0, 0.0, 0.0);

    let mut grid = make_grid();
    let col_left = (0..=GRID_SIZE_Y as usize)
        .map(|i| {
            let t = i as f32 / GRID_SIZE_Y as f32;
            Vec3::quadratic_bezier(t, bl, vec3(-1.0, 2.0, 0.05), tl)
        })
        .collect();
    let col_right = (0..=GRID_SIZE_Y as usize)
        .map(|i| {
            let t = i as f32 / GRID_SIZE_Y as f32;
            Vec3::quadratic_bezier(t, br, vec3(1.0, 2.0, 0.05), tr)
        })
        .collect();
    grid.add_col(col_left);
    grid.add_col(col_right);
    let grid = grid.subdivide(GRID_SIZE_X, 0, Lerp::lerp);

    let grid_back = grid.map(|v| vec3(v.val.x, v.val.y, v.val.z - 0.05));

    let mut grid_top = make_grid();
    grid_top.add_col(grid.last_row());
    grid_top.add_col(grid_back.last_row());

    let mut left_grid = make_grid();
    left_grid.add_col(grid.first_col().clone());
    left_grid.add_col(grid_back.first_col().clone());

    let mut right_grid = make_grid();
    right_grid.add_col(grid.last_col().clone());
    right_grid.add_col(grid_back.last_col().clone());

    let mut geom = MeshGeometry::new();
    for quad in grid.to_ccw_quads() {
        geom.add_face4(vert(quad[0]), vert(quad[1]), vert(quad[2]), vert(quad[3]));
    }
    for quad in grid_back.to_cw_quads() {
        geom.add_face4(vert(quad[0]), vert(quad[1]), vert(quad[2]), vert(quad[3]));
    }
    for quad in grid_top.to_cw_quads() {
        geom.add_face4(vert(quad[0]), vert(quad[1]), vert(quad[2]), vert(quad[3]));
    }
    for quad in left_grid.to_cw_quads() {
        geom.add_face4(vert(quad[0]), vert(quad[1]), vert(quad[2]), vert(quad[3]));
    }
    for quad in right_grid.to_ccw_quads() {
        geom.add_face4(vert(quad[0]), vert(quad[1]), vert(quad[2]), vert(quad[3]));
    }

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::FaceNormals)
}

pub fn create_ground() -> BufferedGeometry {
    let mut grid = make_grid();
    grid.add_col(vec![vec3(-200.0, 0.0, 200.0), vec3(-200.0, 0.0, -200.0)]);
    grid.add_col(vec![vec3(200.0, 0.0, 200.0), vec3(200.0, 0.0, -200.0)]);
    let grid = grid.subdivide(10, 10, Vec3::lerp);
    let mut geom = MeshGeometry::new();
    for quad in grid.to_ccw_quads() {
        geom.add_face4_data(
            vert(quad[0]),
            vert(quad[1]),
            vert(quad[2]),
            vert(quad[3]),
            face_normal(vec3(0.0, 1.0, 0.0)),
        );
    }

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormals)
}
