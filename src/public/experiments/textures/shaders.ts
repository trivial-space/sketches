import {
	Vec2Sym,
	FloatSym,
	sym,
	add,
	vec4,
	vec3,
	program,
	defMain,
	uniform,
	assign,
	$xy,
	mul,
	vec2,
	float,
	Sampler2DSym,
	div,
	texture,
	$x,
	Vec4Sym,
	$y,
	$z,
	$w,
	abs,
	sub,
	pow,
} from '@thi.ng/shader-ast'
import {
	aspectCorrectedUV,
	fit1101,
	fit0111,
	voronoise2,
} from '@thi.ng/shader-ast-stdlib'
import { getFragmentGenerator } from '../../../shared-utils/shaders/ast'

const fs = getFragmentGenerator()

let uResolution: Vec2Sym
let uTime: FloatSym

export const noiseShader = fs(
	program([
		(uResolution = uniform('vec2', 'resolution')),
		(uTime = uniform('float', 'time')),
		defMain(() => {
			let uv: Vec2Sym
			let col: FloatSym
			return [
				(uv = sym(aspectCorrectedUV($xy(fs.gl_FragCoord), uResolution))),
				// dynamically create a multi-octave version of `snoise2`
				// computed over 4 octaves w/ given phase shift and decay
				// factor (both per octave)
				(col = sym(
					// additive('vec2', snoise2, 4)(add(uv, uTime), vec2(2), float(0.5)),
					voronoise2(mul(add(uv, uTime), 20), float(1), float(1)),
				)),
				// (col = sym(snoise2(add(mul(uv, 2), time)))),
				assign(fs.gl_FragColor, vec4(vec3(fit1101(col)), 1)),
			]
		}),
	]),
)

let uNoiseTex: Sampler2DSym

export const noise2Shader = fs(
	program([
		(uResolution = uniform('vec2', 'resolution')),
		(uTime = uniform('float', 'time')),
		(uNoiseTex = uniform('sampler2D', 'noiseTex')),
		defMain(() => {
			let uv: Vec2Sym
			let col: Vec4Sym
			return [
				(uv = sym(
					add(div(uTime, 3), div($xy(fs.gl_FragCoord), mul(uResolution, 1.5))),
				)),
				(col = sym(texture(uNoiseTex, uv))),
				assign(
					fs.gl_FragColor,
					vec4(
						vec3(
							fit1101(
								add(
									add(
										add(fit0111($x(col)), div(fit0111($y(col)), 2)),
										div(fit0111($z(col)), 4),
									),
									div(fit0111($w(col)), 8),
								),
							),
						),
						1,
					),
				),
			]
		}),
	]),
)

export const lineShader = fs(
	program([
		(uResolution = uniform('vec2', 'resolution')),
		(uTime = uniform('float', 'time')),
		(uNoiseTex = uniform('sampler2D', 'noiseTex')),
		defMain(() => {
			let uv: Vec2Sym
			let col: Vec4Sym
			let rand: FloatSym
			let dist: FloatSym
			return [
				(uv = sym(div($xy(fs.gl_FragCoord), uResolution))),
				(col = sym(
					texture(
						uNoiseTex,
						vec2(mul($x(uv), 2), add(mul(mul(0.7, $y(uv)), $y(uv)), uTime)),
					),
				)),
				(rand = sym(
					fit1101(
						add(
							add(
								add(fit0111($x(col)), div(fit0111($y(col)), 2)),
								div(fit0111($z(col)), 4),
							),
							div(fit0111($w(col)), 8),
						),
					),
				)),
				(dist = sym(pow(abs(fit0111($x(uv))), float(1.2)))),
				assign(
					fs.gl_FragColor,
					vec4(vec3(sub(add(0.5, mul(rand, 0.5)), dist)), 1),
				),
			]
		}),
	]),
)
