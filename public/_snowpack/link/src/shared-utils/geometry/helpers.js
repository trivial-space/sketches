import {partial} from "../../../projects/libs/dist/fp/core.js";
import {
  divideVertical,
  divideHorizontal,
  extrudeBottom,
  triangulate
} from "../../../projects/libs/dist/geometry/quad.js";
import {flatten} from "../../../projects/libs/dist/utils/sequence.js";
import {convertStackGLGeometry} from "../../../projects/painter/dist/utils/stackgl.js";
const vertDiv = partial(divideVertical, 0.5, 0.5);
const horzDiv = partial(divideHorizontal, 0.5, 0.5);
export function subdivide(times = 1, quads) {
  for (let i = 0; i < times; i++) {
    quads = flatten(quads.map((q) => flatten(vertDiv(q).map(horzDiv))));
  }
  return quads;
}
const uvQuad = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1]
];
function makeFormData(quad, normal, segments) {
  const quads = subdivide(segments, [quad]);
  const position = flatten(quads);
  return convertStackGLGeometry({
    position,
    normal: position.map(() => normal),
    uv: flatten(subdivide(segments, [uvQuad])),
    cells: triangulate(quads.length)
  });
}
export function makeXYPlane(size, segments) {
  const normal = [0, 0, -1];
  const quad = extrudeBottom([0, -size * 2, 0], [
    [-size, size, 0],
    [size, size, 0]
  ]);
  const plane = makeFormData(quad, normal, segments);
  console.log(plane, quad);
  return plane;
}
export function makeXZPlane(size, segments) {
  const normal = [0, 1, 0];
  const quad = extrudeBottom([0, 0, -size * 2], [
    [-size, 0, size],
    [size, 0, size]
  ]);
  return makeFormData(quad, normal, segments);
}
export function makeYZPlane(size, segments) {
  const normal = [1, 0, 0];
  const quad = extrudeBottom([0, -size * 2, 0], [
    [0, size, -size],
    [0, size, size]
  ]);
  return makeFormData(quad, normal, segments);
}
