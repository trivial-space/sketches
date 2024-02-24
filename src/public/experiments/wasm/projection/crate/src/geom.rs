use bytemuck::{Pod, Zeroable};
use serde::Serialize;
use tvs_libs::{
    data_structures::grid::make_grid_from_cols,
    geometry::mesh_geometry_3d::{
        face_normal, face_section, MeshBufferedGeometryType, MeshGeometry, Position3D,
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
fn vert(pos: Vec3) -> Vertex {
    Vertex { pos }
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

    let grid_front = make_grid_from_cols(vec![col_left, col_right]).subdivide(GRID_SIZE_X, 0);

    let grid_back = grid_front.map(|v| vec3(v.val.x, v.val.y, v.val.z - 0.05));

    let grid_top = make_grid_from_cols(vec![grid_front.last_row(), grid_back.last_row()]);

    let left_grid = make_grid_from_cols(vec![
        grid_front.first_col().clone(),
        grid_back.first_col().clone(),
    ]);

    let right_grid = make_grid_from_cols(vec![
        grid_front.last_col().clone(),
        grid_back.last_col().clone(),
    ]);

    let mut geom = MeshGeometry::new();
    geom.add_grid_ccw_quads_data(&grid_front.map(|v| vert(v.val)), face_section(0));
    geom.add_grid_cw_quads_data(&grid_back.map(|v| vert(v.val)), face_section(1));
    geom.add_grid_cw_quads_data(&grid_top.map(|v| vert(v.val)), face_section(2));
    geom.add_grid_cw_quads_data(&left_grid.map(|v| vert(v.val)), face_section(3));
    geom.add_grid_ccw_quads_data(&right_grid.map(|v| vert(v.val)), face_section(4));

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormals)
}

pub fn create_ground() -> BufferedGeometry {
    let grid = make_grid_from_cols(vec![
        vec![vec3(-200.0, 0.0, 200.0), vec3(-200.0, 0.0, -200.0)],
        vec![vec3(200.0, 0.0, 200.0), vec3(200.0, 0.0, -200.0)],
    ]);
    let grid = grid.subdivide(10, 10);

    let mut geom = MeshGeometry::new();
    geom.add_grid_ccw_quads_data(&grid.map(|v| vert(v.val)), face_normal(vec3(0.0, 1.0, 0.0)));

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormals)
}
