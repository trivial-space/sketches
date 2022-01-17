import {
  getFragmentGenerator,
  getVertexGenerator
} from "../../../_snowpack/link/src/shared-utils/shaders/ast.js";
import {
  program,
  defMain,
  assign,
  vec4,
  input,
  uniform,
  output,
  mul,
  $xyz,
  normalize,
  vec3,
  $y,
  $x
} from "../../../_snowpack/pkg/@thi.ng/shader-ast.js";
import {halfLambert} from "../../../_snowpack/pkg/@thi.ng/shader-ast-stdlib.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vNormal;
let vUv;
let aPosition;
let aNormal;
let aUV;
let uTransform;
let uProjection;
let uNormalMatrix;
let uView;
export const lineVert = vs(program([
  aPosition = input("vec3", "position"),
  aNormal = input("vec3", "normal"),
  aUV = input("vec2", "uv"),
  uTransform = uniform("mat4", "transform"),
  uProjection = uniform("mat4", "projection"),
  uView = uniform("mat4", "view"),
  uNormalMatrix = uniform("mat4", "normalMatrix"),
  vNormal = output("vec3", "vNormal"),
  vUv = output("vec2", "vUv"),
  defMain(() => [
    assign(vNormal, normalize($xyz(mul(uNormalMatrix, vec4(aNormal, 1))))),
    assign(vUv, aUV),
    assign(vs.gl_Position, mul(mul(mul(uProjection, uView), uTransform), vec4(aPosition, 1)))
  ])
]));
export const lineFrag = fs(program([
  vNormal = input("vec3", "vNormal"),
  vUv = input("vec2", "vUv"),
  defMain(() => [
    assign(fs.gl_FragColor, vec4(mul(halfLambert(normalize(vNormal), vec3(0, -1, 0)), vec3(1, $y(vUv), $x(vUv))), 1))
  ])
]));
