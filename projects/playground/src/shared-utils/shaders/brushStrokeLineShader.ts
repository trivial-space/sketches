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
	max,
	min,
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'
import { getFragmentGenerator, getVertexGenerator } from './ast'

const fs = getFragmentGenerator('precision highp float;')
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym
let vLength: FloatSym

// Vertex

let uSize: Vec2Sym
let aPosition: Vec2Sym
let aLength: FloatSym
let aLocalUV: Vec2Sym
export const brushStrokeVert = vs(
	program([
		(uSize = uniform('vec2', 'size')),
		(aPosition = input('vec2', 'position')),
		(aLength = input('float', 'length')),
		(aLocalUV = input('vec2', 'localUv')),
		(vUv = output('vec2', 'vUv')),
		(vLength = output('float', 'vLength')),
		defMain(() => [
			assign(vUv, aLocalUV),
			assign(vLength, aLength),
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
let uColor: Vec3Sym
let noise: Vec4Sym
let noiseVal: FloatSym
export const brushStrokeFrag = fs(
	program([
		(uNoiseTex = uniform('sampler2D', 'noiseTex')),
		(uColor = uniform('vec3', 'color')),
		(vUv = input('vec2', 'vUv')),
		(vLength = input('float', 'vLength')),
		(uSize = uniform('vec2', 'size')),
		defMain(() => [
			(noise = sym(
				texture(uNoiseTex, mul(vec2($x(vUv), vLength), vec2(1.0, 0.1))),
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
			assign(noiseVal, sub(noiseVal, pow(abs(fit0111($x(vUv))), float(10)))),
			assign(noiseVal, sub(noiseVal, pow(abs(fit0111($y(vUv))), float(20)))),
			assign(
				noiseVal,
				mul(
					noiseVal,
					mul(
						sub(
							add(float(1), noiseVal),
							pow(min(float(1), div(vLength, 10)), float(4)),
						),
						0.5,
					),
				),
			),
			assign(
				fs.gl_FragColor,
				vec4(
					// mix(vec3(0.2, 0.8, 0.6), vec3(0, 0.6, 0.2), noiseVal),
					uColor,
					mul(0.9, noiseVal),
				),
			),
			// assign(fs.gl_FragColor, vec4(1, 0, 0, 1)),
		]),
	]),
)
