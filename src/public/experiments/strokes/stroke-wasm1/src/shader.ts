import { assign, defMain, div, mul, vec2, vec4 } from '@thi.ng/shader-ast'
import { defShader } from '../../../../../shared-utils/shaders/ast'

export const shader = defShader({
	attribs: {
		position: 'vec2',
		uv: 'vec2',
	},
	varying: {
		vUv: 'vec2',
	},
	uniforms: {
		size: 'vec2',
	},
	vs: (gl, uniforms, inp, out) => [
		defMain(() => [
			assign(out.vUv, inp.uv),
			assign(
				gl.gl_Position,
				vec4(mul(div(inp.position, uniforms.size), vec2(1, -1)), 0, 1),
			),
		]),
	],
	fs: (gl, uniforms, inp, out) => [
		defMain(() => [assign(out.fragColor, vec4(inp.vUv, 0, 1))]),
	],
})
