import {
  times,
  repeat,
  zip,
  flatten,
  window
} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {Q} from "./context.js";
import {noise2d} from "../../../_snowpack/link/projects/libs/dist/math/noise.js";
import {lineSegment} from "../../../_snowpack/link/src/shared-utils/geometry/lines_3d.js";
import {add, length, mul, sub} from "../../../_snowpack/link/projects/libs/dist/math/vectors.js";
function easeOutQuad(x) {
  return 1 - (1 - x) * (1 - x);
}
function easeInOutQuint(x) {
  return x < 0.5 ? 16 * x * x * x * x * x : 1 - Math.pow(-2 * x + 2, 5) / 2;
}
function easeInOutQuart(x) {
  return x < 0.5 ? 8 * x * x * x * x : 1 - Math.pow(-2 * x + 2, 4) / 2;
}
const last = (arr) => arr[arr.length - 1];
export function line(start, end, fragments = 20) {
  const vec = sub(end, start);
  const len = length(vec);
  const dir = mul(1 / len, vec);
  const normal = [dir[1], -dir[0]];
  const parts = repeat(fragments, 1 / fragments).map((x, i) => x * i);
  const steps = parts.map(easeInOutQuart).map((x) => x * len);
  const seed = Math.random() * 10;
  const distortStrengths = parts.map((x) => Math.sin(x * Math.PI) * noise2d(x * 3, seed) * len / 3 / fragments);
  const points = zip((a, b) => [a, b], steps, distortStrengths).map(([step, distortStrength]) => {
    const p = add(add(start, mul(step, dir)), mul(distortStrength, normal));
    return p;
  }).concat([end]);
  return window(2, points).map(([p1, p2]) => {
    let v = sub(p2, p1);
    let l = length(v);
    return lineSegment({vertex: p1, length: l, direction: mul(1 / l, v)});
  }).concat([
    lineSegment({vertex: end, direction: dir, length: 1 / (fragments * 3)})
  ]);
}
export function strokePatch(width, height, steps) {
  const step = height / steps;
  const start = [-width / 2, -height / 2];
  const end = [width / 2, -height / 2 + step / 2];
  const [sX, sY] = start;
  const [eX, eY] = end;
  const seedX = Math.random() * 20;
  const seedY = Math.random() * 20;
  const deltaX = (i) => width / 8 * noise2d(i, seedX);
  const deltaY = (i) => step / 2 * noise2d(i, seedY);
  const lines = flatten(times((i) => [
    [
      [sX + deltaX(i), sY + step * i + deltaY(i)],
      [eX + deltaX(i + steps), eY + step * i + deltaY(i + steps)]
    ],
    [
      [eX + deltaX(i + steps), eY + step * i + deltaY(i + steps)],
      [sX + deltaX(i + 1), sY + step * (i + 1) + deltaY(i + 1)]
    ]
  ], steps)).concat([
    [
      [sX + deltaX(steps), sY + height + deltaY(steps)],
      [eX + deltaX(steps + steps), eY + height + deltaY(steps + steps)]
    ]
  ]).flatMap(([p1, p2]) => line(p1, p2, 20));
  return lines;
}
Q.set("lines", {line1: []});
