import {
	defn,
	Vec2Sym,
	FloatSym,
	sym,
	add,
	ret,
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
} from '@thi.ng/shader-ast'
import {
	aspectCorrectedUV,
	fit1101,
	snoise2,
	additive,
} from '@thi.ng/shader-ast-stdlib'
import { getFragmentGenerator } from '../../shared-utils/shaders/ast'

const fs = getFragmentGenerator()

let getImage = defn(
	'vec4',
	'mainImage',
	['vec2', 'vec2', 'float'],
	(fragCoord, res, time) => {
		let uv: Vec2Sym
		let col: FloatSym
		return [
			(uv = sym(aspectCorrectedUV(fragCoord, res))),
			// dynamically create a multi-octave version of `snoise2`
			// computed over 4 octaves w/ given phase shift and decay
			// factor (both per octave)
			(col = sym(
				additive('vec2', snoise2, 4)(add(uv, time), vec2(2.1111), float(0.533)),
			)),
			// (col = sym(snoise2(add(mul(uv, 2), time)))),
			ret(vec4(vec3(fit1101(col)), 1)),
		]
	},
)

let resolution: Vec2Sym
let time: FloatSym

export const noiseShader = fs(
	program([
		(resolution = uniform('vec2', 'resolution')),
		(time = uniform('float', 'time')),
		defMain(() => [
			assign(fs.gl_FragColor, getImage($xy(fs.gl_FragCoord), resolution, time)),
		]),
	]),
)
