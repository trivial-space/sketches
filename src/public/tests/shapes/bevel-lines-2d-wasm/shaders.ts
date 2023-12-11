import { fit0111 } from '@thi.ng/shader-ast-stdlib'
import {
	defShader,
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
	div,
} from '@thi.ng/shader-ast'

// Fragment

export const shader = defShader({
	attribs: {
		position: 'vec2',
		uv: 'vec2',
	},
	uniforms: {
		size: 'vec2',
	},
	varying: {
		vUv: 'vec2',
	},
	vs(gl, uniforms, inp, out) {
		return [
			defMain(() => [
				assign(out.vUv, inp.uv),
				assign(
					gl.gl_Position,
					vec4(mul(div(inp.position, uniforms.size), vec2(1, -1)), 0, 1),
				),
			]),
		]
	},
	fs(gl, uniforms, inp, out) {
		return [
			defMain(() => [
				assign(out.fragColor, vec4($x(inp.vUv), $y(inp.vUv), 1, 1)),
			]),
		]
	},
})
