import {
  $w,
  $y,
  assign,
  defMain,
  discard,
  div,
  dot,
  eq,
  float,
  gt,
  ifThen,
  indexMat,
  input,
  mul,
  output,
  program,
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
let aPosition2D;
let aPosition3D;
let aColor;
let uColor;
let uSize;
let uPointSize;
let vColor;
export const point2DVert = vs(program([
  aPosition2D = input("vec2", "position"),
  aColor = input("vec4", "color"),
  uColor = uniform("vec4", "uColor"),
  uSize = uniform("vec2", "uSize"),
  uPointSize = uniform("float", "uPointSize"),
  vColor = output("vec4", "vColor"),
  defMain(() => [
    assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor)),
    assign(vs.gl_PointSize, uPointSize),
    assign(vs.gl_Position, vec4(mul(fit0111(div(aPosition2D, uSize)), vec2(1, -1)), 0, 1))
  ])
]));
let uViewMat;
let uProjMat;
let uUseProjection;
export const point3DVert = vs(program([
  aPosition3D = input("vec3", "position"),
  aColor = input("vec4", "color"),
  uColor = uniform("vec4", "uColor"),
  uSize = uniform("vec2", "uSize"),
  uPointSize = uniform("float", "uPointSize"),
  uViewMat = uniform("mat4", "uViewMat"),
  uProjMat = uniform("mat4", "uProjectionMat"),
  uUseProjection = uniform("bool", "uUseProjection"),
  vColor = output("vec4", "vColor"),
  defMain(() => {
    let projCol;
    return [
      assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor)),
      projCol = sym(indexMat(uProjMat, 1)),
      assign(vs.gl_Position, mul(uProjMat, mul(uViewMat, vec4(aPosition3D, 1)))),
      assign(vs.gl_PointSize, ternary(uUseProjection, mul($y(uSize), mul($y(projCol), div(mul(0.5, uPointSize), $w(vs.gl_Position)))), uPointSize))
    ];
  })
]));
export const pointFrag = fs(program([
  vColor = input("vec4", "vColor"),
  defMain(() => {
    let pointCoords;
    return [
      pointCoords = sym(fit0111(fs.gl_PointCoord)),
      ifThen(gt(dot(pointCoords, pointCoords), float(1)), [discard], [assign(fs.gl_FragColor, vColor)])
    ];
  })
]));
