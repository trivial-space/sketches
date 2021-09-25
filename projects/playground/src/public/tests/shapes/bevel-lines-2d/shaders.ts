import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../../shared-utils/shaders/ast'
import {
	program,
	defMain,
	assign,
	vec4,
	input,
	output,
	mul,
	Vec2Sym,
	$y,
	$x,
	vec2,
} from '@thi.ng/shader-ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym

// Vertex

let aPosition: Vec2Sym
let aUV: Vec2Sym
export const lineVert = vs(
	// prettier-ignore
	program([
		(aPosition = input('vec2', 'position')),
		(aUV = input('vec2', 'uv')),
		(vUv = output('vec2', 'vUv')),

		defMain(() => [
			assign(vUv, aUV),
			assign(vs.gl_Position, vec4(mul(aPosition, vec2(1, -1)), 0, 1)),
		]),
	]),
)

// Fragment

export const lineFrag = fs(
	// prettier-ignore
	program([
		(vUv = input('vec2', 'vUv')),
		defMain(() => [
			assign(fs.gl_FragColor, vec4($x(vUv), $y(vUv), 1, 1)),
		]),
	]),
)
