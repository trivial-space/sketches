import * as __SNOWPACK_ENV__ from '../../../_snowpack/env.js';
import.meta.env = __SNOWPACK_ENV__;

import {hsl, hslToRGB} from "../../../_snowpack/link/projects/libs/dist/graphics/colors.js";
import {repeat, stop} from "../../../_snowpack/link/src/shared-utils/scheduler.js";
import {createLines2DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/lines/lines.js";
import {createPoints2DSketch} from "../../../_snowpack/link/src/shared-utils/sketches/points/points.js";
import {Q} from "./context.js";
import {connections, nameSpaceCount, nodes, updateNodes} from "./nodes.js";
export const points = createPoints2DSketch(Q, "points", {
  pointSize: 20,
  dynamicForm: true
});
export const lines = createLines2DSketch(Q, "lines", {
  lineWidth: 3,
  color: [1, 1, 1, 1],
  dynamicForm: true,
  drawSettings: {
    clearColor: [0, 0, 0, 1],
    clearBits: Q.gl.COLOR_BUFFER_BIT,
    cullFace: Q.gl.BACK,
    enable: [Q.gl.CULL_FACE]
  }
});
const timeToSort = 10;
let time = 0;
repeat((tpf) => {
  time += tpf;
  updateNodes(tpf);
  points.update({
    positions: nodes.map((n) => n.pos),
    colors: nodes.map((n) => [
      ...hslToRGB(hsl(n.ns / nameSpaceCount, 1, 0.5)),
      1
    ])
  });
  lines.update({
    segments: connections.map(([p1, p2]) => [nodes[p1].pos, nodes[p2].pos])
  });
  Q.painter.draw({sketches: [lines.sketch, points.sketch]});
  if (time >= timeToSort * 1e3)
    stop("render");
}, "render");
undefined /* [snowpack] import.meta.hot */ ?.accept();
