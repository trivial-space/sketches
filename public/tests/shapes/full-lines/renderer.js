import {Q, events} from "./context.js";
import {flatMap, times, flatten} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {initPerspectiveViewport} from "../../../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
import {lineFrag, lineVert} from "./shaders.js";
import {mat4} from "../../../_snowpack/pkg/gl-matrix.js";
import {makeClear} from "../../../_snowpack/link/projects/painter/dist/utils/context.js";
import {lineToTriangleStripGeometry} from "../../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
const {gl, state: s} = Q;
initPerspectiveViewport(Q, {
  position: [0, 10, 30]
});
const shade = Q.getShade("line").update({
  vert: lineVert,
  frag: lineFrag
});
const form1 = Q.getForm("line1");
const transform1 = mat4.create();
const sketch1 = Q.getSketch("line1").update({
  form: form1,
  shade,
  uniforms: {
    transform: transform1
  }
});
const form2 = Q.getForm("line2");
const transform2 = mat4.fromTranslation(mat4.create(), [10, 0, 0]);
const sketch2 = Q.getSketch("line2").update({
  form: form2,
  shade,
  uniforms: {
    transform: transform2
  }
});
const normalMat = mat4.create();
export const scene = Q.getLayer("scene").update({
  sketches: [sketch1, sketch2],
  uniforms: {
    view: () => s.viewPort.camera.viewMat,
    projection: () => s.viewPort.camera.projectionMat,
    normalMatrix: () => mat4.invert(normalMat, mat4.transpose(normalMat, s.viewPort.camera.viewMat))
  },
  drawSettings: {
    clearColor: [1, 1, 1, 1],
    clearBits: makeClear(gl, "depth", "color"),
    cullFace: gl.FRONT,
    enable: [gl.DEPTH_TEST, gl.CULL_FACE]
  },
  directRender: true
});
Q.listen("renderer", events.FRAME, (s2) => {
  form1.update({
    attribs: {
      position: {
        buffer: new Float32Array(flatMap((seg) => seg.vertex, s2.lines.line1)),
        storeType: "DYNAMIC"
      },
      normal: {
        buffer: new Float32Array(flatMap((s3) => s3.normal, s2.lines.line1)),
        storeType: "DYNAMIC"
      },
      uv: {
        buffer: new Float32Array(flatten(times((i) => [i / s2.lines.line1.length, i / s2.lines.line1.length], s2.lines.line1.length))),
        storeType: "DYNAMIC"
      }
    },
    drawType: "LINE_STRIP",
    itemCount: s2.lines.line1.length
  });
  form2.update(lineToTriangleStripGeometry(s2.lines.line1, 0.4, {
    withBackFace: true,
    withNormals: true,
    withUVs: true,
    storeType: "DYNAMIC"
  }));
});
