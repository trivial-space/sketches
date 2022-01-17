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
  vec2
} from "../../../_snowpack/pkg/@thi.ng/shader-ast.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vUv;
let aPosition;
let aUV;
export const lineVert = vs(program([
  aPosition = input("vec2", "position"),
  aUV = input("vec2", "uv"),
  vUv = output("vec2", "vUv"),
  defMain(() => [
    assign(vUv, aUV),
    assign(vs.gl_Position, vec4(mul(aPosition, vec2(1, -1)), 0, 1))
  ])
]));
export const lineFrag = fs(program([
  vUv = input("vec2", "vUv"),
  defMain(() => [
    assign(fs.gl_FragColor, vec4($x(vUv), $y(vUv), 1, 1))
  ])
]));
