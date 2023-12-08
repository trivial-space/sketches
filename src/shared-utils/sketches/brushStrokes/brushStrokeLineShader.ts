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
	abs,
	div,
	clamp,
} from '@thi.ng/shader-ast'
import { fit0111, fit1101 } from '@thi.ng/shader-ast-stdlib'
import { Texture } from 'tvs-painter/dist/texture'
import { getFragmentGenerator, getVertexGenerator } from '../../shaders/ast'

export interface BrushStrokeUniforms {
	size: [number, number]
	noiseTex: Texture
	color: [number, number, number]
	texScale: [number, number]
	edgeSharpness: number
}

const fs = getFragmentGenerator('precision highp float;')
const vs = getVertexGenerator()

// varyings

let vUv: Vec2Sym
let vLength: FloatSym
let vWidth: FloatSym

// Vertex

let uSize: Vec2Sym
let aPosition: Vec2Sym
let aLength: FloatSym
let aWidth: FloatSym
let aLocalUV: Vec2Sym
export const brushStrokeVert = vs(
	program([
		(uSize = uniform('vec2', 'size')),
		(aPosition = input('vec2', 'position')),
		(aLength = input('float', 'length')),
		(aWidth = input('float', 'width')),
		(aLocalUV = input('vec2', 'localUv')),
		(vUv = output('vec2', 'vUv')),
		(vLength = output('float', 'vLength')),
		(vWidth = output('float', 'vWidth')),
		defMain(() => [
			assign(vUv, aLocalUV),
			assign(vLength, div(aLength, $x(uSize))),
			assign(vWidth, div(aWidth, $x(uSize))),
			assign(
				vs.gl_Position,
				vec4(mul(fit0111(div(aPosition, uSize)), vec2(1, -1)), 0, 1),
			),
		]),
	]),
)

// Fragment

let uNoiseTex: Sampler2DSym
let uColor: Vec3Sym
let uTexScale: Vec2Sym
let uEdgeSharpness: FloatSym
let noise: Vec4Sym
let noiseVal: FloatSym
export const brushStrokeFrag = fs(
	program([
		(uSize = uniform('vec2', 'size')),
		(uNoiseTex = uniform('sampler2D', 'noiseTex')),
		(uTexScale = uniform('vec2', 'texScale')),
		(uColor = uniform('vec3', 'color')),
		(uEdgeSharpness = uniform('float', 'edgeSharpness')),
		(vUv = input('vec2', 'vUv')),
		(vLength = input('float', 'vLength')),
		(vWidth = input('float', 'vWidth')),
		defMain(() => [
			(noise = sym(
				texture(
					uNoiseTex,
					mul(vec2(mul(fit0111($x(vUv)), vWidth), vLength), uTexScale),
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
				sub(noiseVal, pow(abs(fit0111($x(vUv))), uEdgeSharpness)),
			),
			assign(
				noiseVal,
				sub(noiseVal, pow(abs(fit0111($y(vUv))), mul(uEdgeSharpness, 2))),
			),
			// assign(
			// 	noiseVal,
			// 	mul(
			// 		noiseVal,
			// 		mul(
			// 			sub(
			// 				add(float(1), noiseVal),
			// 				pow(min(float(1), div(vLength, 10)), float(4)),
			// 			),
			// 			0.5,
			// 		),
			// 	),
			// ),
			assign(
				fs.gl_FragColor,
				vec4(
					// mix(vec3(0.2, 0.8, 0.6), vec3(0, 0.6, 0.2), noiseVal),
					uColor,
					clamp(mul(0.9, noiseVal), float(0), float(1)),
				),
			),
			// assign(fs.gl_FragColor, vec4(1, 0, 0, 1)),
		]),
	]),
)
