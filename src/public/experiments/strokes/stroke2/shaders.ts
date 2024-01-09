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
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'
import { defShader } from '../../../../shared-utils/shaders/ast'

export const lineShader = defShader({
	attribs: {
		position: 'vec2',
		length: 'float',
		localUv: 'vec2',
	},
	uniforms: {
		size: 'vec2',
		noiseTex: 'sampler2D',
	},
	varying: {
		vUv: 'vec2',
		vLength: 'float',
	},
	vs: (gl, unis, ins, outs) => [
		defMain(() => [
			assign(outs.vUv, ins.localUv),
			assign(outs.vLength, ins.length),
			assign(
				gl.gl_Position,
				vec4(
					$x(ins.position),
					mul(-1, mul(div($x(unis.size), $y(unis.size)), $y(ins.position))),
					0,
					1,
				),
			),
		]),
	],
	fs: (gl, unis, ins, outs) => {
		let noise: Vec4Sym
		let noiseVal: FloatSym
		return [
			defMain(() => [
				(noise = sym(
					texture(
						unis.noiseTex,
						mul(vec2($x(ins.vUv), ins.vLength), vec2(1.0, 0.1)),
					),
				)),
				// noiseVal = sym(($x(noise))),
				(noiseVal = sym(
					fit1101(
						add(
							add(
								add(fit0111($x(noise)), fit0111($y(noise))),
								fit0111($z(noise)),
							),
							fit0111($w(noise)),
						),
					),
				)),
				assign(noiseVal, mul(1.1, noiseVal)),
				assign(noiseVal, pow(noiseVal, float(0.1))),
				assign(
					noiseVal,
					sub(noiseVal, pow(abs(fit0111($x(ins.vUv))), float(10))),
				),
				assign(
					noiseVal,
					sub(noiseVal, pow(abs(fit0111($y(ins.vUv))), float(20))),
				),
				assign(
					noiseVal,
					mul(
						noiseVal,
						mul(
							sub(
								add(float(1), noiseVal),
								pow(min(float(1), div(ins.vLength, 10)), float(4)),
							),
							0.5,
						),
					),
				),
				assign(
					outs.fragColor,
					vec4(
						// mix(vec3(0.2, 0.8, 0.6), vec3(0, 0.6, 0.2), noiseVal),
						vec3(0, 0.6, 0.2),
						mul(0.9, noiseVal),
					),
				),
				// assign(outs.fragColor, vec4(1, 0, 0, 1)),
			]),
		]
	},
})
