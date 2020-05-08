import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../shared-utils/shaders/ast'
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
} from '@thi.ng/shader-ast'
import { halfLambert } from '@thi.ng/shader-ast-stdlib'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vNormal: Vec3Sym

// Vertex

let aPosition: Vec2Sym
export const lineVert = vs(
	// prettier-ignore
	program([
		(aPosition = input('vec2', 'position')),

		defMain(() => [
			assign(vs.gl_Position, vec4(aPosition, 0, 1)),
		]),
	]),
)

// Fragment

export const lineFrag = fs(
	// prettier-ignore
	program([
		(vNormal = input('vec3', 'vNormal')),
		defMain(() => [
			assign(fs.gl_FragColor, vec4(vec3(1.0, 0.0, 0.0), 1.0)),
		]),
	]),
)
