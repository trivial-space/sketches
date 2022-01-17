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
  mix,
  vec2,
  sub
} from "../../../_snowpack/pkg/@thi.ng/shader-ast.js";
import {fit0111, fit1101} from "../../../_snowpack/pkg/@thi.ng/shader-ast-stdlib.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vNormal;
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
let uNoiseTex;
let noise;
let noiseVal;
export const lineFrag = fs(program([
  uNoiseTex = uniform("sampler2D", "noiseTex"),
  vNormal = input("vec3", "vNormal"),
  vUv = input("vec2", "vUv"),
  defMain(() => [
    noise = sym(texture(uNoiseTex, mul(vUv, vec2(1, 10)))),
    noiseVal = sym(fit1101(add(add(add(fit0111($x(noise)), fit0111($y(noise))), fit0111($z(noise))), fit0111($w(noise))))),
    assign(noiseVal, pow(noiseVal, float(0.15))),
    assign(noiseVal, mul(mul(noiseVal, mul(sub(add(float(1), noiseVal), pow($y(vUv), float(4))), 0.5)), 1)),
    assign(fs.gl_FragColor, vec4(mix(vec3(0.4, 1, 0.6), vec3(0, 0.6, 0.2), noiseVal), noiseVal))
  ])
]));
