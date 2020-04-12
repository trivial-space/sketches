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

let vUv: Vec2Sym

// Vertex

let aPosition: Vec3Sym
let aUv: Vec2Sym
let uTransform: Mat4Sym
let uProjection: Mat4Sym
let uView: Mat4Sym
export const planeVert = vs(
	program([
		(aPosition = input('vec3', 'position')),
		(aUv = input('vec2', 'uv')),
		(uTransform = uniform('mat4', 'transform')),
		(uProjection = uniform('mat4', 'projection')),
		(uView = uniform('mat4', 'view')),
		(vUv = output('vec2', 'vUv')),
		defMain(() => [
			assign(vUv, aUv),
			assign(
				vs.gl_Position,
				mul(mul(mul(uProjection, uView), uTransform), vec4(aPosition, 1)),
			),
		]),
	]),
)

// Fragment

let uTex: Sampler2DSym
export const planeFrag = fs(
	program([
		(uTex = uniform('sampler2D', 'texture')),
		(vUv = input('vec2', 'vUv')),
		defMain(() => [assign(fs.gl_FragColor, texture(uTex, vUv))]),
	]),
)

console.log(planeVert)
console.log(planeFrag)
