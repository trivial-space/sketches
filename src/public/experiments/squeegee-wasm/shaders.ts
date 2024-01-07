import {
	$w,
	$x,
	$xyz,
	$y,
	Vec2Sym,
	Vec4Sym,
	add,
	assign,
	defMain,
	div,
	float,
	max,
	min,
	mix,
	mul,
	sub,
	sym,
	texture,
	vec2,
	vec4,
} from '@thi.ng/shader-ast'
import { fit0111 } from '@thi.ng/shader-ast-stdlib'
import { defFragment, defShader } from '../../../shared-utils/shaders/ast'

export const brushShader = defShader({
	attribs: {
		pos: 'vec2',
		width: 'float',
		length: 'float',
		length_offset: 'float',
		idx: 'float',
	},
	varying: {
		vIdx: 'float',
	},
	uniforms: {
		size: 'vec2',
	},
	vs(gl, uni, inp, out) {
		return [
			defMain(() => [
				assign(out.vIdx, inp.idx),
				assign(
					gl.gl_Position,
					vec4(mul(fit0111(div(inp.pos, uni.size)), vec2(1, -1)), 0, 1),
				),
				assign(gl.gl_PointSize, inp.width),
			]),
		]
	},
	fs(gl, uni, inp, out) {
		let coords: Vec2Sym
		return [
			defMain(() => [
				(coords = sym(fit0111(gl.gl_PointCoord))),
				assign(
					out.fragColor,
					vec4(
						mix(float(0), float(1), inp.vIdx),
						mix(float(1), float(0), inp.vIdx),
						1,
						sub(
							1,
							div(
								add(mul($x(coords), $x(coords)), mul($y(coords), $y(coords))),
								1.0,
							),
						),
					),
				),
			]),
		]
	},
})

export const whiteFrag = defFragment({
	fs: (gl, unis, inp, out) => [
		defMain(() => [assign(out.fragColor, vec4(1, 1, 1, 1))]),
	],
})

export const diffuseFrag = defFragment({
	uniforms: {
		source: 'sampler2D',
		brush: 'sampler2D',
	},
	fs: (gl, unis, inp, out) => {
		let sourceColor: Vec4Sym
		let brushColor: Vec4Sym
		return [
			defMain(() => [
				(sourceColor = sym(texture(unis.source, inp.coords))),
				(brushColor = sym(texture(unis.brush, inp.coords))),
				assign(
					out.fragColor,
					mix(
						vec4(1, 1, 1, 1),
						vec4(mix($xyz(sourceColor), $xyz(brushColor), $w(brushColor)), 1),
						float(0.999),
					),
				),
			]),
		]
	},
})
