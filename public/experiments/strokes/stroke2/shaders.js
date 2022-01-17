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
  vec3,
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
  div,
  min
} from "../../../_snowpack/pkg/@thi.ng/shader-ast.js";
import {fit0111, fit1101} from "../../../_snowpack/pkg/@thi.ng/shader-ast-stdlib.js";
const fs = getFragmentGenerator("precision highp float;");
const vs = getVertexGenerator();
let vUv;
let vLength;
let uSize;
let aPosition;
let aLength;
let aLocalUV;
export const lineVert = vs(program([
  uSize = uniform("vec2", "size"),
  aPosition = input("vec2", "position"),
  aLength = input("float", "length"),
  aLocalUV = input("vec2", "localUv"),
  vUv = output("vec2", "vUv"),
  vLength = output("float", "vLength"),
  defMain(() => [
    assign(vUv, aLocalUV),
    assign(vLength, aLength),
    assign(vs.gl_Position, vec4($x(aPosition), mul(-1, mul(div($x(uSize), $y(uSize)), $y(aPosition))), 0, 1))
  ])
]));
let uNoiseTex;
let noise;
let noiseVal;
export const lineFrag = fs(program([
  uNoiseTex = uniform("sampler2D", "noiseTex"),
  vUv = input("vec2", "vUv"),
  vLength = input("float", "vLength"),
  uSize = uniform("vec2", "size"),
  defMain(() => [
    noise = sym(texture(uNoiseTex, mul(vec2($x(vUv), vLength), vec2(1, 0.1)))),
    noiseVal = sym(fit1101(add(add(add(fit0111($x(noise)), fit0111($y(noise))), fit0111($z(noise))), fit0111($w(noise))))),
    assign(noiseVal, mul(1.1, noiseVal)),
    assign(noiseVal, pow(noiseVal, float(0.1))),
    assign(noiseVal, sub(noiseVal, pow(abs(fit0111($x(vUv))), float(10)))),
    assign(noiseVal, sub(noiseVal, pow(abs(fit0111($y(vUv))), float(20)))),
    assign(noiseVal, mul(noiseVal, mul(sub(add(float(1), noiseVal), pow(min(float(1), div(vLength, 10)), float(4))), 0.5))),
    assign(fs.gl_FragColor, vec4(vec3(0, 0.6, 0.2), mul(0.9, noiseVal)))
  ])
]));
