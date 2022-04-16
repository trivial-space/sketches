import { getFragmentGenerator, getVertexGenerator } from '../shaders/ast'
import {
	program,
	defMain,
	assign,
	vec4,
	Mat4Sym,
	Vec3Sym,
	Vec2Sym,
	input,
	uniform,
	output,
	Vec4Sym,
	mul,
	$xyz,
	Sampler2DSym,
	texture,
	div,
	$xy,
	sym,
	length,
	$,
	add,
	sub,
	FloatSym,
	vec3,
	$w,
	defn,
	ret,
	TaggedFn2,
	TaggedFn3,
	fract,
	$x,
	$y,
	floor,
	max,
	sqrt,
	pow,
	float,
} from '@thi.ng/shader-ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varying

let vNormal: Vec3Sym
let vPos: Vec3Sym
let vUv: Vec2Sym

// Vertex

let aPosition: Vec3Sym
let aNormal: Vec3Sym
let aUv: Vec2Sym
let uTransform: Mat4Sym
let uProjection: Mat4Sym
let uView: Mat4Sym
export const groundVert = vs(
	program([
		(aPosition = input('vec3', 'position')),
		(aNormal = input('vec3', 'normal')),
		(aUv = input('vec2', 'uv')),
		(uTransform = uniform('mat4', 'transform')),
		(uProjection = uniform('mat4', 'projection')),
		(uView = uniform('mat4', 'view')),
		(vNormal = output('vec3', 'vNormal')),
		(vPos = output('vec3', 'vPos')),
		(vUv = output('vec2', 'vUv')),
		defMain(() => [
			assign(vNormal, aNormal),
			assign(vUv, aUv),
			assign(vPos, aPosition),
			assign(
				vs.gl_Position,
				mul(mul(mul(uProjection, uView), uTransform), vec4(aPosition, 1)),
			),
		]),
	]),
)

// Fragment
let distanceColor: Vec3Sym
let grid: Vec2Sym
let lines: Vec2Sym
let line

export const defaultGroundTextureFn = defn(
	'vec4',
	'groundColor',
	['vec4', 'float', 'vec2'],
	(reflectionColor, distance, coords) => [
		(distanceColor = sym(
			vec3(
				pow(max(float(0), sub(1, div(distance, 90))), float(0.8)),
				pow(max(float(0), sub(1, div(distance, 95))), float(0.8)),
				pow(max(float(0), sub(1, div(distance, 100))), float(0.8)),
			),
		)),
		(grid = sym(mul(fract(mul(coords, 40)), 0.02))),
		(lines = sym(mul(floor(add(fract(mul(coords, 40)), 0.03)), 0.04))),
		(line = sym(max($x(lines), $y(lines)))),
		ret(
			vec4(
				mul(
					div(
						add(
							mul(
								$xyz(reflectionColor),
								sub(sub(1, mul(line, 2)), mul($w(reflectionColor), 0.7)),
							),
							sub(
								vec3(add(0.5, add($x(grid), $y(grid)))),
								vec3(line, line, div(line, 2)),
							),
						),
						1.6,
					),
					distanceColor,
				),
				1,
			),
		),
	],
)

let uReflection: Sampler2DSym
let uReflectionStrength: FloatSym
let uSize: Vec2Sym
let color: Vec4Sym
let distance: FloatSym
export const makeGroundFrag = (
	groundColorFn: TaggedFn3<
		'vec4',
		'float',
		'vec2',
		'vec4'
	> = defaultGroundTextureFn,
) =>
	fs(
		program([
			(uReflection = uniform('sampler2D', 'reflection')),
			(uReflectionStrength = uniform('float', 'reflectionStrength')),
			(uSize = uniform('vec2', 'size')),
			(vNormal = input('vec3', 'vNormal')),
			(vPos = input('vec3', 'vPos')),
			(vUv = input('vec2', 'vUv')),
			defMain(() => [
				(color = sym(texture(uReflection, div($xy(fs.gl_FragCoord), uSize)))),
				// assign(color, vec4($xyz(color), mul($w(color), uReflectionStrength))),
				assign(color, mul(color, uReflectionStrength)),
				(distance = sym(length($(vPos, 'xz')))),
				assign(fs.gl_FragColor, groundColorFn(color, distance, vUv)),
				// assign(fs.gl_FragColor, vec4(vec3(distance), 1)),
			]),
		]),
	)
