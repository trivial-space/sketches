import {events, Q} from "./context.js";
import {lineFrag, lineVert} from "./shaders.js";
import {strokePatch} from "./state.js";
import {lineToFormCollection} from "../../../_snowpack/link/src/shared-utils/geometry/lines_2d.js";
Q.state.time = 0;
Q.state.device.sizeMultiplier = window.devicePixelRatio;
const shade = Q.getShade("line").update({
  vert: lineVert,
  frag: lineFrag
});
const linePoints = strokePatch(1.5, 1.5, 20);
const data = lineToFormCollection(linePoints, {
  lineWidth: 0.05,
  smouthCount: 4
});
const forms = data.map((line, i) => Q.getForm("line" + i).update(line));
const sketches = forms.map((form, i) => Q.getSketch("line" + i).update({form, shade}));
export const scene = Q.getLayer("scene").update({
  sketches,
  drawSettings: {
    clearColor: [1, 1, 1, 1],
    enable: [Q.gl.CULL_FACE],
    cullFace: Q.gl.BACK
  },
  directRender: true
});
Q.listen("index", events.RESIZE, () => {
  scene.update();
  Q.painter.compose(scene);
  console.log(scene._targets[0].width, Q.gl.drawingBufferWidth);
});
