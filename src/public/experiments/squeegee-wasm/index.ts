import '../../../shared-utils/css/fullscreen.css'
import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../shared-utils/app/painterState'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'
import { wasmGeometryToFormData } from '../../../shared-utils/wasm/utils'
import { Q } from './context'
import init, { setup, update } from './crate/pkg/tvs_sketch_squeegee'
import { brushShader, diffuseFrag } from './shaders'

const BRUSH_LAYER_SIZE = [1024, 2048] as const

Q.state.device.sizeMultiplier = window.devicePixelRatio

const points = createPoints2DSketch(Q, 'points1', {
	dynamicForm: true,
	pointSize: 40,
	width: BRUSH_LAYER_SIZE[0],
	height: BRUSH_LAYER_SIZE[1],
})

const brushShade = Q.getShade('brush').update(brushShader)
const brushForm = Q.getForm('brush')
const brushSketch = Q.getSketch('brush').update({
	form: brushForm,
	shade: brushShade,
})

const brushLayer = Q.getLayer('brush').update({
	sketches: [brushSketch, points.sketch],
	width: BRUSH_LAYER_SIZE[0],
	height: BRUSH_LAYER_SIZE[1],
	drawSettings: {
		enable: [Q.gl.BLEND],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		clearColor: [0, 0, 0, 0],
		blendEquationSeparate: [Q.gl.FUNC_ADD, Q.gl.MAX],
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.SRC_ALPHA,
			Q.gl.DST_ALPHA,
		],
	},
})

const diffuseEffect = Q.getEffect('diffuse').update({
	frag: diffuseFrag,
	uniforms: { source: '0', brush: () => brushLayer.image() },
})

const diffuseLayer = Q.getLayer('diffuse').update({
	width: BRUSH_LAYER_SIZE[0],
	height: BRUSH_LAYER_SIZE[1],
	selfReferencing: true,
	sketches: diffuseEffect,
})

Q.emit(baseEvents.RESIZE)

init().then(() => {
	setup(...BRUSH_LAYER_SIZE)

	addToLoop((tpf) => {
		console.log('wasm update')
		const data = update(tpf / 1000)
		console.log('wasm update end')

		points.update({
			positions: [data.gravity_center, data.puller_pos, data.brush_pos],
			colors: [
				[0, 1, 0, 1],
				[1, 0, 0, 1],
				[0, 0, 1, 1],
			],
		})

		console.log('form/sketch update')
		brushSketch.update({
			form: brushForm.update(
				wasmGeometryToFormData(data.brush_geometry, 'DYNAMIC'),
			),
			uniforms: {
				size: BRUSH_LAYER_SIZE,
			},
		})
		console.log('form/sketch update end')

		console.log('render')
		Q.painter.compose(brushLayer, diffuseLayer).show(diffuseLayer)
		console.log('render end')
	}, 'loop')

	startLoop()
})
