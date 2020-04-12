import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../shared-utils/shaders/ast'
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
let pos: Vec4Sym
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
			assign(pos, mul(uTransform, vec4(aPosition, 1.0))),
			assign(vPos, $xyz(pos)),
			assign(vs.gl_Position, mul(mul(uProjection, uView), pos)),
		]),
	]),
)

// Fragment

let uReflection: Sampler2DSym
let uSize: Vec2Sym
let color: Vec4Sym
let distance
export const groundFrag = fs(
	program([
		(uReflection = uniform('sampler2D', 'reflection')),
		(uSize = uniform('vec2', 'size')),
		(vNormal = input('vec3', 'vNormal')),
		(vPos = input('vec3', 'vPos')),
		(vUv = input('vec2', 'vUv')),
		defMain(() => [
			assign(color, texture(uReflection, div($xy(fs.gl_FragCoord), uSize))),
			assign(fs.gl_FragColor, vec4($xyz(div(color, 2)), 1)),
		]),
	]),
)
