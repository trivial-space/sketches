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
	vec2,
	sub,
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'
import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../../shared-utils/shaders/ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym

// Vertex

let aPosition: Vec3Sym
let aUV: Vec2Sym
let projectionMat: Mat4Sym
let viewMat: Mat4Sym
export const lineVert = vs(
	// prettier-ignore
	program([
		(viewMat = uniform('mat4', 'view')),
		(projectionMat = uniform('mat4', 'projection')),
		(aPosition = input('vec3', 'position')),
		(aUV = input('vec2', 'uv')),
		(vUv = output('vec2', 'vUv')),

		defMain(() => [
			assign(vUv, aUV),
			assign(vs.gl_Position, mul(projectionMat, mul(viewMat, vec4(aPosition, 1)))),
		]),
	]),
)

// Fragment

let uNoiseTex: Sampler2DSym
let noise: Vec4Sym
let noiseVal: FloatSym
export const lineFrag = fs(
	// prettier-ignore
	program([
		(uNoiseTex = uniform('sampler2D', 'noiseTex')),
		(vUv = input('vec2', 'vUv')),
		defMain(() => [
			noise = sym(texture(uNoiseTex, mul(vUv, vec2(1.0, 10)))),
			// noiseVal = sym(($x(noise))),
			noiseVal = sym(
				fit1101(add(
					add(
						add(fit0111($x(noise)), fit0111($y(noise))),
						fit0111($z(noise))),
					fit0111($w(noise))))
			),
			assign(noiseVal, pow(noiseVal, float(0.15))),
			assign(noiseVal,
				mul(
					mul(
						noiseVal,
						mul(
							sub(add(float(1), noiseVal), pow($y(vUv), float(4))),
							0.5
						)
						// 1
					),
					// sub(1, pow(abs(fit0111($x(vUv))), float(8)))
					1
				)),
			assign(fs.gl_FragColor, vec4(
				// mix(vec3(0.4, 1, 0.6), vec3(0, 0.6, 0.2), noiseVal),
				// noiseVal
				1, 0, 0,$x(vUv),
			)),
		]),
	]),
)
