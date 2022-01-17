import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {getPainterContext} from "../../../_snowpack/link/src/shared-utils/painterState.js";
import {createPoints2DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/points/points.js";
import {times} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {makeClear} from "../../../_snowpack/link/projects/painter/dist/utils/context.js";
import {addToLoop, startLoop} from "../../../_snowpack/link/src/shared-utils/frameLoop.js";
export const canvas = document.getElementById("canvas");
export const Q = getPainterContext(canvas);
const pointCount = 100;
const pointsDynamic = createPoints2DSketch(Q, "points1", {
  pointSize: 10,
  dynamicForm: true,
  drawSettings: {
    clearColor: [0, 0, 0, 1],
    clearBits: makeClear(Q.gl, "color"),
    cullFace: Q.gl.BACK,
    enable: [Q.gl.CULL_FACE]
  }
});
const pointsStatic = createPoints2DSketch(Q, "points2", {
  pointSize: 30,
  positions: times(() => [
    Math.random() * Q.gl.drawingBufferWidth,
    Math.random() * Q.gl.drawingBufferHeight
  ], 20),
  color: [1, 1, 0, 1]
});
addToLoop(() => {
  pointsDynamic.update({
    positions: times(() => [
      Math.random() * Q.gl.drawingBufferWidth,
      Math.random() * Q.gl.drawingBufferHeight
    ], pointCount),
    colors: times(() => [Math.random(), Math.random(), Math.random(), 1], pointCount)
  });
  Q.painter.draw({sketches: [pointsDynamic.sketch, pointsStatic.sketch]});
}, "loop");
startLoop();
undefined /* [snowpack] import.meta.hot */ ?.accept();
