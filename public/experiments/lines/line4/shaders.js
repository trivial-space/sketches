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
  uniform,
  $w,
  $z,
  add,
  float,
  mix,
  pow,
  sub,
  sym,
  texture,
  vec3
} from "../../../_snowpack/pkg/@thi.ng/shader-ast.js";
import {fit0111, fit1101} from "../../../_snowpack/pkg/@thi.ng/shader-ast-stdlib.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vUv;
let vLength;
let aPosition;
let aLength;
let aUV;
let uSize;
export const lineVert = vs(program([
  uSize = uniform("vec2", "uSize"),
  aPosition = input("vec2", "position"),
  aLength = input("float", "length"),
  aUV = input("vec2", "uv"),
  vUv = output("vec2", "vUv"),
  vLength = output("float", "vLength"),
  defMain(() => [
    assign(vUv, aUV),
    assign(vLength, aLength),
    assign(vs.gl_Position, vec4(mul(fit0111(div(aPosition, uSize)), vec2(1, -1)), 0, 1))
  ])
]));
let uNoiseTex;
let noise;
let noiseVal;
export const lineFrag = fs(program([
  uNoiseTex = uniform("sampler2D", "noiseTex"),
  vUv = input("vec2", "vUv"),
  vLength = input("float", "vLength"),
  defMain(() => [
    noise = sym(texture(uNoiseTex, vec2($x(vUv), mul(vLength, 2e-4)))),
    noiseVal = sym(fit1101(add(add(add(fit0111($x(noise)), fit0111($y(noise))), fit0111($z(noise))), fit0111($w(noise))))),
    assign(noiseVal, pow(noiseVal, float(0.12))),
    assign(noiseVal, mul(mul(noiseVal, mul(sub(add(1, noiseVal), pow($y(vUv), float(4))), 0.5)), 0.9)),
    assign(fs.gl_FragColor, vec4(mix(vec3(0.4, 1, 0.6), vec3(0, 0.6, 0.2), noiseVal), noiseVal))
  ])
]));
