import {
	defMain,
	assign,
	vec4,
	mul,
	vec3,
	$y,
	$x,
	Vec4Sym,
	texture,
	sym,
	FloatSym,
	add,
	$w,
	$z,
	pow,
	float,
	vec2,
	sub,
	abs,
	div,
	min,
	clamp,
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'
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

export const lineShader = defShader({
	attribs: {
		position: 'vec2',
		localUv: 'vec2',
		uv: 'vec2',
	},
	uniforms: {
		size: 'vec2',
		noiseTex: 'sampler2D',
	},
	varying: {
		vUv: 'vec2',
		vLocalUv: 'vec2',
	},
	vs: (gl, unis, ins, outs) => [
		defMain(() => [
			assign(outs.vUv, ins.uv),
			assign(outs.vLocalUv, ins.localUv),
			assign(
				gl.gl_Position,
				vec4(mul(div(ins.position, unis.size), vec2(1, -1)), 0, 1),
			),
		]),
	],
	fs: (gl, unis, ins, outs) => {
		let noise: Vec4Sym
		let noiseVal: FloatSym
		return [
			defMain(() => [
				(noise = sym(texture(unis.noiseTex, mul(ins.vUv, vec2(2, 0.8))))),

				(noiseVal = sym($x(noise))),

				// add noise resolutions
				assign(noiseVal, fit0111(noiseVal)),
				assign(noiseVal, add(noiseVal, fit0111($y(noise)))),
				assign(noiseVal, add(noiseVal, fit0111($z(noise)))),
				assign(noiseVal, add(noiseVal, fit0111($w(noise)))),
				assign(noiseVal, fit1101(noiseVal)),

				// adjust intensity
				assign(noiseVal, add(0.15, noiseVal)),
				assign(noiseVal, clamp(noiseVal, float(0), float(1))),
				assign(noiseVal, pow(noiseVal, float(0.25))),

				// fade out edges
				assign(
					noiseVal,
					sub(noiseVal, pow(abs(fit0111($x(ins.vLocalUv))), float(10))),
				),
				assign(
					noiseVal,
					sub(noiseVal, pow(abs(fit0111($y(ins.vUv))), float(10))),
				),

				// fade out at the end
				assign(
					noiseVal,
					mul(
						noiseVal,
						min(float(1), pow(sub(float(1.6), $x(ins.vUv)), float(3))),
					),
				),

				assign(
					outs.fragColor,
					vec4(
						vec3(0, 0.6, 0.2),
						clamp(mul(0.9, noiseVal), float(0), float(1)),
					),
				),
			]),
		]
	},
})
