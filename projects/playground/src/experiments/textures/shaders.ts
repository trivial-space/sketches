import {
	defn,
	Vec2Sym,
	FloatSym,
	sym,
	add,
	vec2,
	float,
	ret,
	vec4,
	vec3,
	program,
	defMain,
	uniform,
	TaggedFn3,
	Vec4Sym,
	assign,
	$xy,
} from '@thi.ng/shader-ast'
import {
	additive,
	aspectCorrectedUV,
	fit1101,
	snoise2,
} from '@thi.ng/shader-ast-stdlib'
import { targetGLSL, GLSLVersion } from '@thi.ng/shader-ast-glsl'

const fs = targetGLSL({
	version: GLSLVersion.GLES_100,
	type: 'fs',
	prelude: 'precision mediump float;',
})

let getImage = defn(
	'vec4',
	'mainImage',
	['vec2', 'vec2', 'float'],
	(fragCoord: Vec2Sym, res: Vec2Sym, time: FloatSym) => {
		let uv: Vec2Sym
		let col: FloatSym
		return [
			(uv = sym(aspectCorrectedUV(fragCoord, res))),
			// dynamically create a multi-octave version of `snoise2`
			// computed over 4 octaves w/ given phase shift and decay
			// factor (both per octave)
			(col = sym(
				additive('vec2', snoise2, 4)(add(uv, time), vec2(2), float(0.5)),
			)),
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

console.log(noiseShader)
