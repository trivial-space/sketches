import {
  getFragmentGenerator,
  getVertexGenerator
} from "../../_snowpack/link/src/shared-utils/shaders/ast.js";
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
  texture,
  div,
  sym,
  $y,
  ternary,
  gt,
  float
} from "../../_snowpack/pkg/@thi.ng/shader-ast.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vUv;
let vHeight;
let aPosition;
let aUv;
let uTransform;
let uProjection;
let uView;
let pos;
export const planeVert = vs(program([
  aPosition = input("vec3", "position"),
  aUv = input("vec2", "uv"),
  uTransform = uniform("mat4", "transform"),
  uProjection = uniform("mat4", "projection"),
  uView = uniform("mat4", "view"),
  vUv = output("vec2", "vUv"),
  vHeight = output("float", "vHeight"),
  defMain(() => [
    assign(vUv, aUv),
    pos = sym(mul(uTransform, vec4(aPosition, 1))),
    assign(vHeight, $y(pos)),
    assign(vs.gl_Position, mul(mul(uProjection, uView), pos))
  ])
]));
let uTex;
let uWithDistance;
let alpha;
export const planeFrag = fs(program([
  uTex = uniform("sampler2D", "texture"),
  uWithDistance = uniform("float", "withDistance"),
  vUv = input("vec2", "vUv"),
  vHeight = input("float", "vHeight"),
  defMain(() => [
    alpha = sym(ternary(gt(uWithDistance, float(0)), div(vHeight, 12), float(1))),
    assign(fs.gl_FragColor, vec4($xyz(texture(uTex, vUv)), alpha))
  ])
]));
console.log(planeVert);
console.log(planeFrag);
