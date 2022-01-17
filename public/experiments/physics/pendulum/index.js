import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {initPerspectiveViewport} from "../../../_snowpack/link/src/shared-utils/vr/perspectiveViewport.js";
import {Q} from "./context.js";
import {addToLoop, startLoop} from "../../../_snowpack/link/src/shared-utils/frameLoop.js";
import {baseEvents} from "../../../_snowpack/link/src/shared-utils/painterState.js";
import {createLines3DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/lines/lines.js";
import {createPoints3DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/points/points.js";
import {createMirrorScene} from "../../../_snowpack/link/src/shared-utils/vr/mirror-scene.js";
import {anchor, p1, p2, p3, update} from "./physics.js";
initPerspectiveViewport(Q, {
  moveSpeed: 10,
  fovy: Math.PI * 0.6,
  position: [0, 30, -30],
  rotationY: Math.PI
});
const lines = createLines3DSketch(Q, "lines", {
  lineWidth: 0.5,
  scalePerspective: true,
  projectionMat: Q.state.viewPort.camera.projectionMat,
  viewMat: Q.state.viewPort.camera.viewMat,
  color: [Math.random(), Math.random(), Math.random(), 1],
  dynamicForm: true
});
const points = createPoints3DSketch(Q, "points", {
  pointSize: 2,
  scalePerspective: true,
  projectionMat: Q.state.viewPort.camera.projectionMat,
  viewMat: Q.state.viewPort.camera.viewMat,
  color: [Math.random(), Math.random(), Math.random(), 1],
  dynamicForm: true
});
const scene = createMirrorScene(Q, [lines.sketch, points.sketch]);
addToLoop((tpf) => {
  Q.state.device.tpf = tpf;
  Q.emit(baseEvents.FRAME);
  update(tpf);
  lines.update({points: [anchor, p1.pos, p2.pos, p3.pos]});
  points.update({positions: [p1.pos, p2.pos, p3.pos]});
  Q.painter.compose(scene.mirrorScene, scene.scene).show(scene.scene);
}, "loop");
Q.listen("", baseEvents.RESIZE, (s) => lines.update());
startLoop();
undefined /* [snowpack] import.meta.hot */ ?.accept();
