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
	div,
	uniform,
} from '@thi.ng/shader-ast'
import { fit0111 } from '@thi.ng/shader-ast-stdlib'
import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../../shared-utils/shaders/ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym

// Vertex

let aPosition: Vec2Sym
let aUV: Vec2Sym
let uSize: Vec2Sym
export const lineVert = vs(
	program([
		(aPosition = input('vec2', 'position')),
		(aUV = input('vec2', 'uv')),
		(vUv = output('vec2', 'vUv')),
		(uSize = uniform('vec2', 'uSize')),
		defMain(() => [
			assign(vUv, aUV),
			assign(
				vs.gl_Position,
				vec4(mul(fit0111(div(aPosition, uSize)), vec2(1, -1)), 0, 1),
			),
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
