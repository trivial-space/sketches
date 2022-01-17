import {events, Q} from "./context.js";
import {
  createLine,
  lineToFormCollection,
  newLinePoint,
  smouthenPoint
} from "../../../_snowpack/link/src/shared-utils/geometry/lines_2d.js";
import {Buttons} from "../../../_snowpack/link/projects/libs/dist/events/pointer.js";
import {makeClear} from "../../../_snowpack/link/projects/painter/dist/utils/context.js";
import {lineFrag, lineVert} from "./shaders.js";
import {baseEvents} from "../../../_snowpack/link/src/shared-utils/painterState.js";
Q.state.device.sizeMultiplier = window.devicePixelRatio;
const lineWidth = 40;
const opts = {};
let currentLine = createLine(opts).append(newLinePoint([0, 0], lineWidth));
let sketches = [];
const shade = Q.getShade("shade").update({
  frag: lineFrag,
  vert: lineVert
});
const scene = Q.getLayer("scene").update({
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
      const point = newLinePoint([startPoint[0], startPoint[1]], lineWidth);
      currentLine = createLine(opts).append(point);
    } else {
      const point = newLinePoint([startPoint[0] - p.drag.x * m, startPoint[1] - p.drag.y * m], lineWidth);
      currentLine?.append(point, true);
      smouthenPoint(currentLine.last?.prev, {depth: 2});
      const formDatas = lineToFormCollection(currentLine, {
        lineWidth,
        storeType: "DYNAMIC"
      });
      sketches = formDatas.map((formData, i) => Q.getForm("line" + i).update(formData)).map((form, i) => Q.getSketch("sketch" + i).update({form, shade}));
      scene.update({
        sketches,
        uniforms: {
          uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight]
        }
      });
      Q.painter.compose(scene);
    }
  } else if (!p.dragging && dragging) {
    dragging = false;
  }
});
Q.listen("index", events.RESIZE, () => {
  scene.update();
  Q.painter.compose(scene);
});
