import {partial} from "../../_snowpack/link/projects/libs/dist/fp/core.js";
import {normal} from "../../_snowpack/link/projects/libs/dist/geometry/primitives.js";
import {
  divideHorizontal,
  divideVertical,
  extrudeBottom,
  extrudeRight,
  right,
  triangulate
} from "../../_snowpack/link/projects/libs/dist/geometry/quad.js";
import {normalRand} from "../../_snowpack/link/projects/libs/dist/math/random.js";
import {flatten, times} from "../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {convertStackGLGeometry} from "../../_snowpack/link/projects/painter/dist/utils/stackgl.js";
import {Q} from "./context.js";
const vertDiv = partial(divideVertical, 0.5, 0.5);
const horzDiv = partial(divideHorizontal, 0.5, 0.5);
function subdivide(quads, times2 = 1) {
  for (let i = 0; i < times2; i++) {
    quads = flatten(quads.map((q) => flatten(vertDiv(q).map(horzDiv))));
  }
  return quads;
}
function randomColor() {
  return [normalRand(), normalRand(), normalRand()];
}
const boxSliceCount = 10;
function randomDivide(q, sliceCount) {
  const quads = [];
  let rest = q;
  for (let i = sliceCount; i > 1; i--) {
    const upRatio = 1 / i + (Math.random() * 2 - 1) * 0.5 / i;
    const downRatio = 1 / i + (Math.random() * 2 - 1) * 0.5 / i;
    const [left, right2] = divideVertical(upRatio, downRatio, rest);
    quads.push(left);
    rest = right2;
  }
  quads.push(rest);
  return quads;
}
const colors = times(randomColor, 4 * boxSliceCount);
const quad = extrudeBottom([0, -9, 0], [
  [-10, 10, -10],
  [10, 10, -10]
]);
function makeSideSegments(q, count) {
  return randomDivide(q, count).map((q2) => flatten(subdivide(horzDiv(q2))));
}
const box = (() => {
  const count = boxSliceCount;
  const bk = quad;
  const rt = extrudeRight([0, 0, 20], right(bk));
  const ft = extrudeRight([-20, 0, 0], right(rt));
  const lf = extrudeRight([0, 0, -20], right(ft));
  return [
    makeSideSegments(bk, count),
    makeSideSegments(rt, count),
    makeSideSegments(ft, count),
    makeSideSegments(lf, count)
  ];
})();
export const faceNormals = box.map((q) => normal(q[1]));
export const wallsForm = Q.getForm("wallsForm").update(convertStackGLGeometry({
  position: flatten(flatten(box)),
  color: flatten(box.map((side, i) => flatten(side.map((slice, j) => slice.map(() => colors[i * boxSliceCount + j]))))),
  normal: flatten(box.map((side, i) => flatten(side).map(() => faceNormals[i]))),
  cells: triangulate(4 * boxSliceCount * 4 * 2)
}));
