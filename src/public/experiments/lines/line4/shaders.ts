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
	Sampler2DSym,
	Vec4Sym,
	FloatSym,
	$w,
	$z,
	add,
	float,
	mix,
	pow,
	sub,
	sym,
	texture,
	vec3,
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'
import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../../shared-utils/shaders/ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym
let vLength: FloatSym

// Vertex

let aPosition: Vec2Sym
let aLength: FloatSym
let aUV: Vec2Sym
let uSize: Vec2Sym
export const lineVert = vs(
	program([
		(uSize = uniform('vec2', 'uSize')),
		(aPosition = input('vec2', 'position')),
		(aLength = input('float', 'length')),
		(aUV = input('vec2', 'uv')),
		(vUv = output('vec2', 'vUv')),
		(vLength = output('float', 'vLength')),
		defMain(() => [
			assign(vUv, aUV),
			assign(vLength, aLength),
			assign(
				vs.gl_Position,
				vec4(mul(fit0111(div(aPosition, uSize)), vec2(1, -1)), 0, 1),
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
		(vLength = input('float', 'vLength')),
		defMain(() => [
			(noise = sym(texture(uNoiseTex, vec2($x(vUv), mul(vLength, 0.0002))))),
			// (noiseVal = sym($x(noise))),
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
			assign(noiseVal, pow(noiseVal, float(0.12))),
			assign(
				noiseVal,
				mul(
					mul(
						noiseVal,
						mul(sub(add(1, noiseVal), pow($y(vUv), float(4))), 0.5),
					),
					0.9,
				),
			),
			assign(
				fs.gl_FragColor,
				vec4(
					// vec3(0, 0.6, 0.2),
					mix(vec3(0.4, 1, 0.6), vec3(0, 0.6, 0.2), noiseVal),
					noiseVal,
				),
			),
		]),
	]),
)
