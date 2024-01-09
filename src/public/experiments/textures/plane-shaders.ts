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
	FloatSym,
	sym,
	$y,
	ternary,
	gt,
	float,
} from '@thi.ng/shader-ast'
import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../shared-utils/shaders/ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varying

let vUv: Vec2Sym
let vHeight: FloatSym

// Vertex

let aPosition: Vec3Sym
let aUv: Vec2Sym
let uTransform: Mat4Sym
let uProjection: Mat4Sym
let uView: Mat4Sym
let pos: Vec4Sym
export const planeVert = vs(
	program([
		(aPosition = input('vec3', 'position')),
		(aUv = input('vec2', 'uv')),
		(uTransform = uniform('mat4', 'transform')),
		(uProjection = uniform('mat4', 'projection')),
		(uView = uniform('mat4', 'view')),
		(vUv = output('vec2', 'vUv')),
		(vHeight = output('float', 'vHeight')),
		defMain(() => [
			assign(vUv, aUv),
			(pos = sym(mul(uTransform, vec4(aPosition, 1)))),
			assign(vHeight, $y(pos)),
			assign(vs.gl_Position, mul(mul(uProjection, uView), pos)),
		]),
	]),
)

// Fragment

let uTex: Sampler2DSym
let uWithDistance: FloatSym
let alpha: FloatSym
export const planeFrag = fs(
	program([
		(uTex = uniform('sampler2D', 'texture')),
		(uWithDistance = uniform('float', 'withDistance')),
		(vUv = input('vec2', 'vUv')),
		(vHeight = input('float', 'vHeight')),
		defMain(() => [
			(alpha = sym(
				ternary(gt(uWithDistance, float(0)), div(vHeight, 12), float(1)),
			)),
			assign(fs.gl_FragColor, vec4($xyz(texture(uTex, vUv)), alpha)),
		]),
	]),
)

console.log(planeVert)
console.log(planeFrag)
