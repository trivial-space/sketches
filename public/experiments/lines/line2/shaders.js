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
  output,
  mul,
  $y,
  $x,
  vec2,
  div,
  uniform
} from "../../../_snowpack/pkg/@thi.ng/shader-ast.js";
import {fit0111} from "../../../_snowpack/pkg/@thi.ng/shader-ast-stdlib.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vUv;
let aPosition;
let aUV;
let uSize;
export const lineVert = vs(program([
  aPosition = input("vec2", "position"),
  aUV = input("vec2", "uv"),
  vUv = output("vec2", "vUv"),
  uSize = uniform("vec2", "uSize"),
  defMain(() => [
    assign(vUv, aUV),
    assign(vs.gl_Position, vec4(mul(fit0111(div(aPosition, uSize)), vec2(1, -1)), 0, 1))
  ])
]));
export const lineFrag = fs(program([
  vUv = input("vec2", "vUv"),
  defMain(() => [
    assign(fs.gl_FragColor, vec4($x(vUv), $y(vUv), 1, 1))
  ])
]));
