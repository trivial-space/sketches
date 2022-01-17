import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {times} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {mat4} from "../../../_snowpack/pkg/gl-matrix.js";
import {initPerspectiveViewport} from "../../../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
import {Q} from "./context.js";
import {makeClear} from "../../../_snowpack/link/projects/painter/dist/utils/context.js";
import {addToLoop, startLoop} from "../../../_snowpack/link/src/shared-utils/frameLoop.js";
import {baseEvents} from "../../../_snowpack/link/src/shared-utils/painterState.js";
import {createLines3DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/lines/lines.js";
import {defined} from "../../../_snowpack/link/projects/libs/dist/types.js";
initPerspectiveViewport(Q, {
  moveSpeed: 40,
  fovy: Math.PI * 0.6
});
const pointsMat = mat4.fromTranslation(mat4.create(), [0, 0, -100]);
const viewMat = mat4.create();
const pointsCount = 30;
const lines = createLines3DSketch(Q, "lines", {
  lineWidth: 3,
  scalePerspective: true,
  projectionMat: Q.state.viewPort.camera.projectionMat,
  viewMat,
  points: times(() => [
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  ], pointsCount),
  colors: times(() => [Math.random(), Math.random(), Math.random(), 1], pointsCount),
  drawSettings: {
    enable: [Q.gl.DEPTH_TEST],
    clearColor: [1, 0, 1, 1],
    clearBits: makeClear(Q.gl, "depth", "color")
  },
  withPoints: true
});
addToLoop((tpf) => {
  Q.state.device.tpf = tpf;
  Q.emit(baseEvents.FRAME);
  mat4.rotateY(pointsMat, pointsMat, 0.01);
  mat4.mul(viewMat, Q.state.viewPort.camera.viewMat, pointsMat);
  Q.painter.draw({
    sketches: [lines.sketch, lines.pointsSketch].filter(defined)
  });
}, "loop");
Q.listen("", baseEvents.RESIZE, (s) => lines.update());
startLoop();
undefined /* [snowpack] import.meta.hot */ ?.accept();
