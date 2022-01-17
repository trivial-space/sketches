import {mat4} from "../../_snowpack/pkg/gl-matrix.js";
import {makeClear} from "../../_snowpack/link/projects/painter/dist/utils/context.js";
import {plane} from "../../_snowpack/link/projects/painter/dist/utils/geometry/plane.js";
import {events, Q, paint} from "./context.js";
import base from "./glsl/base.frag.js";
import planeFrag from "./glsl/plane-material.frag.js";
import planeVert from "./glsl/plane-material.vert.js";
const paintLayer = Q.getLayer("paint");
const bufferSize = 256;
const effect = Q.getEffect("layer").update({
  frag: base,
  uniforms: {
    size: bufferSize,
    paint: () => paintLayer.image(),
    previous: "0"
  }
});
export const automaton = Q.getLayer("automaton").update({
  effects: effect,
  selfReferencing: true,
  width: bufferSize,
  height: bufferSize,
  bufferStructure: [
    {
      flipY: true,
      wrap: "REPEAT"
    }
  ]
});
const planMat = mat4.fromTranslation(mat4.create(), [0, 0, -3]);
const rotation = 1e-3;
const projection = mat4.perspective(mat4.create(), 45, 1, 0.01, 10);
const form = Q.getForm("plane").update(plane(2, 2));
const shade = Q.getShade("plane").update({
  vert: planeVert,
  frag: planeFrag
});
export const sketch = Q.getSketch("plane").update({
  form,
  shade,
  uniforms: {
    projection,
    transform: () => mat4.rotateY(planMat, planMat, rotation),
    tex: () => automaton.image()
  },
  drawSettings: {
    clearColor: [0, 1, 0, 1],
    clearBits: makeClear(Q.gl, "color")
  }
});
Q.listen("renderer", events.FRAME, () => {
  paintLayer.update({texture: {asset: paint}});
});
