import {mat4} from "../../../_snowpack/pkg/gl-matrix.js";
import * as coords from "../../../_snowpack/link/projects/libs/dist/math/coords.js";
import {mul} from "../../../_snowpack/link/projects/libs/dist/math/vectors.js";
import {flatten, zip} from "../../../_snowpack/link/projects/libs/dist/utils/sequence.js";
import {planeSize} from "../geometries.js";
import * as videos from "./videos.js";
const radius = 25;
const height = 2;
const scale = [1.6, 1, 1];
const rotations = videos.names.map((_, i) => Math.PI * 2 * i / videos.names.length);
const positions = rotations.map((rot) => {
  const phi = -rot - Math.PI / 2;
  const [x, z] = coords.polarToCartesian2D([radius, phi]);
  return [x, height, z];
});
export const screenTransforms = zip((rot, pos) => {
  const t = mat4.fromTranslation(mat4.create(), pos);
  mat4.rotateY(t, t, rot);
  mat4.scale(t, t, scale);
  return t;
}, rotations, positions);
export const pedestalTransforms = zip((rot, pos) => {
  const p = mul(1.045, pos);
  p[1] -= 2;
  const t = mat4.fromTranslation(mat4.create(), p);
  mat4.rotateY(t, t, rot);
  mat4.scale(t, t, scale.map((v) => v * 1.03));
  return t;
}, rotations, positions);
export const lights = flatten(zip((p, r) => [...p, r], positions, rotations));
export const lightSize = [
  planeSize.width * scale[0],
  planeSize.height * scale[1]
];
