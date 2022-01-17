import {getFragmentGenerator, getVertexGenerator} from "../shaders/ast.js";
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
  $xy,
  sym,
  length,
  $,
  add,
  sub,
  vec3,
  $w,
  defn,
  ret,
  fract,
  $x,
  $y,
  floor,
  max,
  pow,
  float
} from "../../../../pkg/@thi.ng/shader-ast.js";
const fs = getFragmentGenerator();
const vs = getVertexGenerator();
let vNormal;
let vPos;
let vUv;
let aPosition;
let aNormal;
let aUv;
let uTransform;
let uProjection;
let uView;
export const groundVert = vs(program([
  aPosition = input("vec3", "position"),
  aNormal = input("vec3", "normal"),
  aUv = input("vec2", "uv"),
  uTransform = uniform("mat4", "transform"),
  uProjection = uniform("mat4", "projection"),
  uView = uniform("mat4", "view"),
  vNormal = output("vec3", "vNormal"),
  vPos = output("vec3", "vPos"),
  vUv = output("vec2", "vUv"),
  defMain(() => [
    assign(vNormal, aNormal),
    assign(vUv, aUv),
    assign(vPos, aPosition),
    assign(vs.gl_Position, mul(mul(mul(uProjection, uView), uTransform), vec4(aPosition, 1)))
  ])
]));
let distanceColor;
let grid;
let lines;
let line;
export const defaultGroundTextureFn = defn("vec4", "groundColor", ["vec4", "float", "vec2"], (reflectionColor, distance2, coords) => [
  distanceColor = sym(vec3(pow(max(float(0), sub(1, div(distance2, 90))), float(0.8)), pow(max(float(0), sub(1, div(distance2, 95))), float(0.8)), pow(max(float(0), sub(1, div(distance2, 100))), float(0.8)))),
  grid = sym(mul(fract(mul(coords, 40)), 0.02)),
  lines = sym(mul(floor(add(fract(mul(coords, 40)), 0.03)), 0.04)),
  line = sym(max($x(lines), $y(lines))),
  ret(vec4(mul(div(add(mul($xyz(reflectionColor), sub(sub(1, mul(line, 2)), mul($w(reflectionColor), 0.7))), sub(vec3(add(0.5, add($x(grid), $y(grid)))), vec3(line, line, div(line, 2)))), 1.6), distanceColor), 1))
]);
let uReflection;
let uReflectionStrength;
let uSize;
let color;
let distance;
export const makeGroundFrag = (groundColorFn = defaultGroundTextureFn) => fs(program([
  uReflection = uniform("sampler2D", "reflection"),
  uReflectionStrength = uniform("float", "reflectionStrength"),
  uSize = uniform("vec2", "size"),
  vNormal = input("vec3", "vNormal"),
  vPos = input("vec3", "vPos"),
  vUv = input("vec2", "vUv"),
  defMain(() => [
    color = sym(texture(uReflection, div($xy(fs.gl_FragCoord), uSize))),
    assign(color, mul(color, uReflectionStrength)),
    distance = sym(length($(vPos, "xz"))),
    assign(fs.gl_FragColor, groundColorFn(color, distance, vUv))
  ])
]));
