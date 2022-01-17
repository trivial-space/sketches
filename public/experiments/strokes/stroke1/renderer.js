import {lineFrag, lineVert} from "./shaders.js";
import {lineToTriangleStripGeometry} from "../../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
import {strokePatch} from "./state.js";
import {clamp} from "../../../_snowpack/link/projects/libs/dist/math/core.js";
import {getNoiseTextureData} from "../../../_snowpack/link/src/shared-utils/texture-helpers.js";
import {Q} from "./context.js";
const shade = Q.getShade("line").update({
  vert: lineVert,
  frag: lineFrag
});
const linePoints = strokePatch(1, 1, 5);
const data = lineToTriangleStripGeometry(linePoints, (seg) => 20 * clamp(1e-3, 28e-4, 1 / (30 * 30) / Math.pow(seg.length, 0.29)), {withUVs: true});
const form = Q.getForm("line").update(data);
export const noiseTex = Q.getLayer("noiseTex").update({
  texture: getNoiseTextureData({
    width: 256,
    height: 256,
    startX: 3,
    startY: 3,
    data: {
      magFilter: "LINEAR",
      minFilter: "LINEAR",
      wrap: "REPEAT"
    }
  })
});
const sketch = Q.getSketch("line").update({
  form,
  shade,
  uniforms: {
    noiseTex: noiseTex.image()
  }
});
export const scene = Q.getLayer("scene").update({
  sketches: [sketch],
  drawSettings: {
    clearColor: [1, 1, 1, 1],
    enable: [Q.gl.BLEND, Q.gl.CULL_FACE],
    cullFace: Q.gl.BACK
  },
  directRender: true
});
