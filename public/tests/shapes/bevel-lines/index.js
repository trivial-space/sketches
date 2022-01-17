import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {events, Q} from "./context.js";
import {lineFrag, lineVert} from "./shaders.js";
import {lineToTriangleStripGeometry} from "../../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
import {strokePatch} from "./state.js";
Q.state.time = 0;
Q.state.device.sizeMultiplier = window.devicePixelRatio;
const shade = Q.getShade("line").update({
  vert: lineVert,
  frag: lineFrag
});
const linePoints = strokePatch(1.9, 1.9, 20);
const data = lineToTriangleStripGeometry(linePoints, 0.05, {withUVs: true});
const form = Q.getForm("line").update(data);
const sketch = Q.getSketch("line").update({form, shade});
export const scene = Q.getLayer("scene").update({
  sketches: sketch,
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
undefined /* [snowpack] import.meta.hot */ ?.accept();
