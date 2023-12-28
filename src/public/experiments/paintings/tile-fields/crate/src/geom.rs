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
    uv: Vec2,
}
impl BufferedVertexData for Vertex {
    fn vertex_layout() -> Vec<VertexType> {
        vec![
            vert_type("position", VertexFormat::Float32x3),
            vert_type("uv", VertexFormat::Float32x2),
        ]
    }
}
impl NoAttributeOverride for Vertex {}
impl Position3D for Vertex {
    fn position(&self) -> Vec3 {
        self.pos
    }
}
impl Lerp<f32> for Vertex {
    fn lerp(self, other: Self, t: f32) -> Self {
        Vertex {
            pos: self.pos.lerp(other.pos, t),
            uv: self.uv.lerp(other.uv, t),
        }
    }
}
fn vert(pos: Vec3, uv: Vec2) -> Vertex {
    Vertex { pos, uv }
}

pub fn create_canvas(width: usize, height: usize) -> BufferedGeometry {
    let w = width as f32 / 200.;
    let h = height as f32 / 100.;
    let tl = vert(vec3(-w, h + 0.5, 0.), vec2(0., 1.));
    let tr = vert(vec3(w, h + 0.5, 0.), vec2(1., 1.));
    let bl = vert(vec3(-w, 0.5, 0.0), vec2(0., 0.));
    let br = vert(vec3(w, 0.5, 0.0), vec2(1., 0.));

    let grid_front =
        make_grid_from_cols(vec![vec![tl, bl], vec![tr, br]]).subdivide(10, 10, Lerp::lerp);

    let grid_back =
        grid_front.map(|v| vert(vec3(v.val.pos.x, v.val.pos.y, v.val.pos.z - 0.25), v.val.uv));

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
    geom.add_grid_ccw_quads(&grid_front);
    geom.add_grid_cw_quads(&grid_back);
    geom.add_grid_cw_quads(&grid_top);
    geom.add_grid_cw_quads(&left_grid);
    geom.add_grid_ccw_quads(&right_grid);

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::FaceNormals)
}

pub fn create_ground() -> BufferedGeometry {
    let grid = make_grid_from_cols(vec![
        vec![
            vert(vec3(-200.0, 0.0, 200.0), vec2(0.0, 0.0)),
            vert(vec3(-200.0, 0.0, -200.0), vec2(0.0, 1.0)),
        ],
        vec![
            vert(vec3(200.0, 0.0, 200.0), vec2(1.0, 0.0)),
            vert(vec3(200.0, 0.0, -200.0), vec2(1.0, 1.0)),
        ],
    ]);
    let grid = grid.subdivide(10, 10, Lerp::lerp);

    let mut geom = MeshGeometry::new();
    geom.add_grid_ccw_quads_data(&grid, face_normal(vec3(0.0, 1.0, 0.0)));

    geom.to_buffered_geometry_by_type(MeshBufferedGeometryType::VertexNormals)
}
