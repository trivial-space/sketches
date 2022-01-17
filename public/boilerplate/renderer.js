import {planeForm} from "./geometries.js";
import frag from "./glsl/base.frag.js";
import vert from "./glsl/base.vert.js";
import {initPerspectiveViewport} from "../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
import {Q} from "./context.js";
console.log("frag", frag);
console.log("vert", vert);
initPerspectiveViewport(Q);
export const baseShade = Q.getShade("base").update({vert, frag});
const sketch = Q.getSketch("quad").update({
  form: planeForm,
  shade: baseShade,
  uniforms: {transform: () => Q.state.entities.quad.transform}
});
export const scene = Q.getLayer("scene").update({
  sketches: [sketch],
  uniforms: {
    view: () => Q.state.viewPort.camera.viewMat,
    projection: () => Q.state.viewPort.camera.projectionMat
  },
  drawSettings: {
    clearBits: Q.gl.DEPTH_BUFFER_BIT | Q.gl.COLOR_BUFFER_BIT
  },
  directRender: true
});
