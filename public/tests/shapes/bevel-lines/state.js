import {times, window} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {lineSegment} from "../../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
import {div, length, sub} from "../../../_snowpack/link/projects/libs/dist/math/vectors.js";
export function strokePatch(width, height, points) {
  const lines = window(2, times((i) => [(Math.random() - 0.5) * width, (Math.random() - 0.5) * height], points)).flatMap(([p1, p2]) => {
    const dir = sub(p2, p1);
    const len = length(dir);
    const direction = div(len, dir);
    return lineSegment({vertex: p1, direction, length: len});
  });
  return lines;
}
