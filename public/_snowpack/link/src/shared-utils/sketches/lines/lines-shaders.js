import {
  $w,
  $x,
  $xy,
  $y,
  $z,
  add,
  assign,
  defMain,
  div,
  eq,
  float,
  indexMat,
  input,
  mul,
  normalize,
  output,
  program,
  sub,
  sym,
  ternary,
  uniform,
  vec2,
  vec4
} from "../../../../../pkg/@thi.ng/shader-ast.js";
import {fit0111} from "../../../../../pkg/@thi.ng/shader-ast-stdlib.js";
import {getFragmentGenerator, getVertexGenerator} from "../../shaders/ast.js";
const vs = getVertexGenerator();
const fs = getFragmentGenerator();
let aPosition1_2D;
let aPosition1_3D;
let aPosition2_2D;
let aPosition2_3D;
let aDirection;
let aColor;
let uColor;
let uSize;
let uLinieWidth;
let vColor;
export const line2DVert = vs(program([
  aPosition1_2D = input("vec2", "position1"),
  aPosition2_2D = input("vec2", "position2"),
  aDirection = input("float", "direction"),
  aColor = input("vec4", "color"),
  uColor = uniform("vec4", "uColor"),
  uSize = uniform("vec2", "uSize"),
  uLinieWidth = uniform("float", "uLineWidth"),
  vColor = output("vec4", "vColor"),
  defMain(() => {
    let diff;
    let normal;
    let width;
    return [
      width = sym(mul(div(uLinieWidth, 2), aDirection)),
      diff = sym(normalize(sub(aPosition1_2D, aPosition2_2D))),
      normal = sym(vec2($y(diff), mul(-1, $x(diff)))),
      assign(vs.gl_Position, vec4(mul(fit0111(div(add(aPosition1_2D, mul(normal, width)), uSize)), vec2(1, -1)), 0, 1)),
      assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor))
    ];
  })
]));
let uViewMat;
let uProjMat;
let uUseProjection;
export const line3DVert = vs(program([
  aPosition1_3D = input("vec3", "position1"),
  aPosition2_3D = input("vec3", "position2"),
  aColor = input("vec4", "color"),
  aDirection = input("float", "direction"),
  uColor = uniform("vec4", "uColor"),
  uSize = uniform("vec2", "uSize"),
  uLinieWidth = uniform("float", "uLineWidth"),
  uViewMat = uniform("mat4", "uViewMat"),
  uProjMat = uniform("mat4", "uProjectionMat"),
  uUseProjection = uniform("bool", "uUseProjection"),
  vColor = output("vec4", "vColor"),
  defMain(() => {
    let projCol;
    let diff;
    let normal;
    let width;
    let pos1;
    let pos2;
    let pos1_2;
    let pos2_2;
    return [
      pos1 = sym(mul(uProjMat, mul(uViewMat, vec4(aPosition1_3D, 1)))),
      pos2 = sym(mul(uProjMat, mul(uViewMat, vec4(aPosition2_3D, 1)))),
      pos1_2 = sym(mul(uSize, div($xy(pos1), $z(pos1)))),
      pos2_2 = sym(mul(uSize, div($xy(pos2), $z(pos2)))),
      width = sym(mul(uLinieWidth, aDirection)),
      diff = sym(normalize(sub($xy(pos1_2), $xy(pos2_2)))),
      normal = sym(vec2($y(diff), mul(-1, $x(diff)))),
      projCol = sym(indexMat(uProjMat, 1)),
      assign(width, ternary(uUseProjection, mul($y(uSize), mul($y(projCol), div(mul(width, 0.5), $w(pos1)))), width)),
      assign(vs.gl_Position, vec4(mul(div(add($xy(pos1_2), mul(normal, width)), uSize), $z(pos1)), $z(pos1), $w(pos1))),
      assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor))
    ];
  })
]));
export const lineFrag = fs(program([
  vColor = input("vec4", "vColor"),
  defMain(() => {
    return [assign(fs.gl_FragColor, vColor)];
  })
]));
