import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../../shared-utils/shaders/ast'
import {
	program,
	defMain,
	assign,
	vec4,
	Vec3Sym,
	input,
	uniform,
	output,
	mul,
	vec3,
	Vec2Sym,
	$y,
	$x,
	Sampler2DSym,
	Vec4Sym,
	texture,
	sym,
	FloatSym,
	add,
	$w,
	$z,
	pow,
	float,
	mix,
	vec2,
	sub,
	abs,
	div,
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym

// Vertex

let uSize: Vec2Sym
let aPosition: Vec2Sym
let aUV: Vec2Sym
export const lineVert = vs(
	program([
		(uSize = uniform('vec2', 'size')),
		(aPosition = input('vec2', 'position')),
		(aUV = input('vec2', 'uv')),
		(vUv = output('vec2', 'vUv')),
		defMain(() => [
			assign(vUv, aUV),
			assign(
				vs.gl_Position,
				vec4(
					$x(aPosition),
					mul(-1, mul(div($x(uSize), $y(uSize)), $y(aPosition))),
					0,
					1,
				),
			),
		]),
	]),
)

// Fragment

let uNoiseTex: Sampler2DSym
let noise: Vec4Sym
let noiseVal: FloatSym
export const lineFrag = fs(
	program([
		(uNoiseTex = uniform('sampler2D', 'noiseTex')),
		(vUv = input('vec2', 'vUv')),
		defMain(() => [
			(noise = sym(texture(uNoiseTex, mul(vUv, vec2(1.0, 1))))),
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
			assign(noiseVal, sub(noiseVal, pow(abs(fit0111($x(vUv))), float(10)))),
			assign(noiseVal, sub(noiseVal, pow(abs(fit0111($y(vUv))), float(50)))),
			assign(
				noiseVal,
				mul(
					mul(
						noiseVal,
						mul(sub(add(float(1), noiseVal), pow($y(vUv), float(4))), 0.5),
						// 1
					),
					// sub(1, pow(abs(fit0111($x(vUv))), float(8)))
					1,
				),
			),
			assign(
				fs.gl_FragColor,
				vec4(
					// mix(vec3(0.4, 1, 0.6), vec3(0, 0.6, 0.2), noiseVal),
					vec3(0, 0.6, 0.2),
					mul(0.9, noiseVal),
				),
			),
			// assign(fs.gl_FragColor, vec4(1, 0, 0, 1)),
		]),
	]),
)
