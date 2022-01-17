import {normal} from "../_snowpack/link/projects/libs/dist/geometry/primitives.js";
import {extrudeBottom, quadTriangles} from "../_snowpack/link/projects/libs/dist/geometry/quad.js";
import {convertStackGLGeometry} from "../_snowpack/link/projects/painter/dist/utils/stackgl.js";
import {Q} from "./context.js";
const quad = extrudeBottom([0, -2, 0], [
  [-1, 1, 0],
  [1, 1, 0]
]);
export const planeForm = Q.getForm("plane").update(convertStackGLGeometry({
  position: quad,
  color: quad.map(() => Q.state.entities.quad.color),
  normal: quad.map(() => normal(quad)),
  cells: quadTriangles
}));
