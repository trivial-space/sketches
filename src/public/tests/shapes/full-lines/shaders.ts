import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../../shared-utils/shaders/ast'
import {
	program,
	defMain,
	assign,
	vec4,
	Mat4Sym,
	Vec3Sym,
	input,
	uniform,
	output,
	mul,
	$xyz,
	normalize,
	vec3,
	Vec2Sym,
	$y,
	$x,
} from '@thi.ng/shader-ast'
import { halfLambert } from '@thi.ng/shader-ast-stdlib'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vNormal: Vec3Sym
let vUv: Vec2Sym

// Vertex

let aPosition: Vec3Sym
let aNormal: Vec3Sym
let aUV: Vec2Sym
let uTransform: Mat4Sym
let uProjection: Mat4Sym
let uNormalMatrix: Mat4Sym
let uView: Mat4Sym
export const lineVert = vs(
	// prettier-ignore
	program([
		(aPosition = input('vec3', 'position')),
		(aNormal = input('vec3', 'normal')),
		(aUV = input('vec2', 'uv')),

		(uTransform = uniform('mat4', 'transform')),
		(uProjection = uniform('mat4', 'projection')),
		(uView = uniform('mat4', 'view')),
		(uNormalMatrix = uniform('mat4', 'normalMatrix')),

		(vNormal = output('vec3', 'vNormal')),
		(vUv = output('vec2', 'vUv')),

		defMain(() => [
			assign(vNormal, normalize($xyz(mul(uNormalMatrix, vec4(aNormal, 1))))),
			assign(vUv, aUV),
			assign(vs.gl_Position,
				mul(mul(mul(uProjection, uView), uTransform), vec4(aPosition, 1))
			),
		]),
	]),
)

// Fragment

export const lineFrag = fs(
	// prettier-ignore
	program([
		(vNormal = input('vec3', 'vNormal')),
		(vUv = input('vec2', 'vUv')),
		defMain(() => [
			assign(fs.gl_FragColor, vec4(
				mul(
					halfLambert(normalize(vNormal), vec3(0, -1, 0)),
					vec3(1.0, $y(vUv), $x(vUv))
				),
				1.0)
			),
		]),
	]),
)
