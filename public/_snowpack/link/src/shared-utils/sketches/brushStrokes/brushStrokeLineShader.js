import {
  program,
  defMain,
  assign,
  vec4,
  input,
  uniform,
  output,
  mul,
  $y,
  $x,
  texture,
  sym,
  add,
  $w,
  $z,
  pow,
  float,
  vec2,
  sub,
  abs,
  div
} from "../../../../../pkg/@thi.ng/shader-ast.js";
import {fit0111, fit1101} from "../../../../../pkg/@thi.ng/shader-ast-stdlib.js";
import {getFragmentGenerator, getVertexGenerator} from "../../shaders/ast.js";
const fs = getFragmentGenerator("precision highp float;");
const vs = getVertexGenerator();
let vUv;
let vLength;
let vWidth;
let uSize;
let aPosition;
let aLength;
let aWidth;
let aLocalUV;
export const brushStrokeVert = vs(program([
  uSize = uniform("vec2", "size"),
  aPosition = input("vec2", "position"),
  aLength = input("float", "length"),
  aWidth = input("float", "width"),
  aLocalUV = input("vec2", "localUv"),
  vUv = output("vec2", "vUv"),
  vLength = output("float", "vLength"),
  vWidth = output("float", "vWidth"),
  defMain(() => [
    assign(vUv, aLocalUV),
    assign(vLength, div(aLength, $x(uSize))),
    assign(vWidth, div(aWidth, $x(uSize))),
    assign(vs.gl_Position, vec4(mul(fit0111(div(aPosition, uSize)), vec2(1, -1)), 0, 1))
  ])
]));
let uNoiseTex;
let uColor;
let uTexScale;
let uEdgeSharpness;
let noise;
let noiseVal;
export const brushStrokeFrag = fs(program([
  uSize = uniform("vec2", "size"),
  uNoiseTex = uniform("sampler2D", "noiseTex"),
  uTexScale = uniform("vec2", "texScale"),
  uColor = uniform("vec3", "color"),
  uEdgeSharpness = uniform("float", "edgeSharpness"),
  vUv = input("vec2", "vUv"),
  vLength = input("float", "vLength"),
  vWidth = input("float", "vWidth"),
  defMain(() => [
    noise = sym(texture(uNoiseTex, mul(vec2(mul(fit0111($x(vUv)), vWidth), vLength), uTexScale))),
    noiseVal = sym(fit1101(add(add(add(fit0111($x(noise)), fit0111($y(noise))), fit0111($z(noise))), fit0111($w(noise))))),
    assign(noiseVal, mul(1.1, noiseVal)),
    assign(noiseVal, pow(noiseVal, float(0.1))),
    assign(noiseVal, sub(noiseVal, pow(abs(fit0111($x(vUv))), uEdgeSharpness))),
    assign(noiseVal, sub(noiseVal, pow(abs(fit0111($y(vUv))), mul(uEdgeSharpness, 2)))),
    assign(fs.gl_FragColor, vec4(uColor, mul(0.9, noiseVal)))
  ])
]));
