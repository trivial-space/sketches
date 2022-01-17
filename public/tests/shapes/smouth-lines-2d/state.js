import {times} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {
  newLinePoint,
  createLine
} from "../../../_snowpack/link/src/shared-utils/geometry/lines_2d.js";
export function strokePatch(width, height, pointsCount) {
  const points = times((i) => [(Math.random() - 0.5) * width, (Math.random() - 0.5) * height], pointsCount);
  return points.reduce((line, point) => {
    return line.append(newLinePoint(point), true);
  }, createLine());
}
export function strokePatch2(pointsCount) {
  const points = times((i) => [
    Math.sin(Math.PI * 2 * (i / pointsCount)) * 0.8,
    Math.cos(Math.PI * 2 * (i / pointsCount)) * 0.8
  ], pointsCount + 1);
  return points.reduce((line, point) => {
    return line.append(newLinePoint(point), true);
  }, createLine());
}
