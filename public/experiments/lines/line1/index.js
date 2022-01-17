import {events, Q} from "./context.js";
import {
  createLine,
  newLinePoint
} from "../../../_snowpack/link/src/shared-utils/geometry/lines_2d.js";
import {Buttons} from "../../../_snowpack/link/projects/libs/dist/events/pointer.js";
import {createLines2DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/lines/lines.js";
import {makeClear} from "../../../_snowpack/link/projects/painter/dist/utils/context.js";
import {once} from "../../../_snowpack/link/src/shared-utils/scheduler.js";
import {baseEvents} from "../../../_snowpack/link/src/shared-utils/painterState.js";
Q.state.device.sizeMultiplier = window.devicePixelRatio;
let currentLine = createLine().append(newLinePoint([0, 0]));
let currentLineSketch = createLines2DSketch(Q, "current-line", {
  dynamicForm: true,
  color: [0.1, 0.1, 0, 1],
  lineWidth: 20
});
const scene = Q.getLayer("scene").update({
  sketches: currentLineSketch.sketch,
  drawSettings: {
    clearColor: [0.8, 0.8, 1, 1],
    clearBits: makeClear(Q.gl, "color")
  },
  directRender: true
});
let dragging = false;
let startPoint = [0, 0];
Q.listen("index", baseEvents.POINTER, (s) => {
  const p = s.device.pointer;
  if (p.dragging) {
    const m = Q.state.device.sizeMultiplier;
    if (!dragging) {
      dragging = true;
      startPoint = [
        p.pressed[Buttons.LEFT].clientX * m,
        p.pressed[Buttons.LEFT].clientY * m
      ];
      const point = newLinePoint([startPoint[0], startPoint[1]]);
      currentLine = createLine().append(point);
    } else {
      const point = newLinePoint([
        startPoint[0] - p.drag.x * m,
        startPoint[1] - p.drag.y * m
      ]);
      currentLine?.append(point);
      once(() => {
        currentLineSketch.update({
          points: [...currentLine].map((p2) => p2.vertex)
        });
        scene.update({
          sketches: currentLineSketch.sketch
        });
        Q.painter.compose(scene);
      }, "update-and-paint");
    }
  } else if (!p.dragging && dragging) {
    dragging = false;
  }
});
Q.listen("index", events.RESIZE, () => {
  scene.update();
  currentLineSketch.update({
    points: [...currentLine].map((p) => p.vertex)
  });
  Q.painter.compose(scene);
});
