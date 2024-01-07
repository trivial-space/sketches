import { Q } from './context'
import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import init, { setup, update } from './crate/pkg/tvs_sketch_squeegee'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'
import { defFragment, defShader } from '../../../shared-utils/shaders/ast'
import {
	$x,
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
import { wasmGeometryToFormData } from '../../../shared-utils/wasm/utils'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const points = createPoints2DSketch(Q, 'points1', {
	dynamicForm: true,
	pointSize: 40,
})

const shader = defShader({
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
								1.4,
							),
						),
					),
				),
			]),
		]
	},
})

const whiteFrag = defFragment({
	fs: (gl, unis, inp, out) => [
		defMain(() => [assign(out.fragColor, vec4(1, 1, 1, 1))]),
	],
})

const diffuseFrag = defFragment({
	uniforms: {
		source: 'sampler2D',
	},
	fs: (gl, unis, inp, out) => {
		let color: Vec4Sym
		return [
			defMain(() => [
				(color = sym(texture(unis.source, inp.coords))),
				assign(out.fragColor, mix(vec4(1, 1, 1, 1), color, float(0.5))),
			]),
		]
	},
})

const whiteEffect = Q.getEffect('white').update({ frag: whiteFrag })

const diffuseEffect = Q.getEffect('diffuse').update({
	frag: diffuseFrag,
	uniforms: { source: '0' },
})

const shade = Q.getShade('brush').update(shader)
const form = Q.getForm('brush')
const sketch = Q.getSketch('brush').update({
	form,
	shade,
})

let layer = Q.getLayer('brush').update({
	sketches: whiteEffect,
})

Q.painter.compose(layer)

init().then(() => {
	setup(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight)

	layer.update({
		sketches: sketch,
		// effects: diffuseEffect,
		drawSettings: {
			enable: [Q.gl.BLEND],
			blendFuncSeparate: [
				Q.gl.SRC_ALPHA,
				Q.gl.ONE_MINUS_SRC_ALPHA,
				Q.gl.SRC_ALPHA,
				Q.gl.ONE,
			],
		},
	})

	addToLoop((tpf) => {
		const data = update(tpf / 1000)

		points.update({
			positions: [data.gravity_center, data.puller_pos, data.brush_pos],
			colors: [
				[0, 0, 0, 1],
				[1, 0, 0, 1],
				[0, 0, 1, 1],
			],
		})

		sketch.update({
			form: form.update(wasmGeometryToFormData(data.brush_geometry, 'DYNAMIC')),
			uniforms: {
				size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
			},
		})

		Q.painter.compose(layer).show(layer)
	}, 'loop')

	startLoop()
})
