import { Q } from './context'
import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import init, { setup, update } from './crate/pkg/tvs_sketch_squeegee'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'
import { wasmGeometryToFormData } from '../../../shared-utils/wasm/utils'
import { brushShader, diffuseFrag, whiteFrag } from './shaders'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const points = createPoints2DSketch(Q, 'points1', {
	dynamicForm: true,
	pointSize: 40,
})

const whiteEffect = Q.getEffect('white').update({ frag: whiteFrag })

const brushShade = Q.getShade('brush').update(brushShader)
const brushForm = Q.getForm('brush')
const brushSketch = Q.getSketch('brush').update({
	form: brushForm,
	shade: brushShade,
})

const diffuseLayer = Q.getLayer('diffuse').update({
	effects: whiteEffect,
	selfReferencing: true,
})

Q.painter.compose(diffuseLayer)

const brushLayer = Q.getLayer('brush').update({
	sketches: brushSketch,
	drawSettings: {
		enable: [Q.gl.BLEND],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		clearColor: [1, 1, 1, 0],
		blendEquationSeparate: [Q.gl.FUNC_ADD, Q.gl.MAX],
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			// Q.gl.SRC_ALPHA,
		],
	},
})

const diffuseEffect = Q.getEffect('diffuse').update({
	frag: diffuseFrag,
	uniforms: { source: '0', brush: () => brushLayer.image() },
})

init().then(() => {
	setup(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight)

	diffuseLayer.update({
		effects: diffuseEffect,
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

		brushSketch.update({
			form: brushForm.update(
				wasmGeometryToFormData(data.brush_geometry, 'DYNAMIC'),
			),
			uniforms: {
				size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
			},
		})

		Q.painter.compose(brushLayer, diffuseLayer).show(diffuseLayer)
	}, 'loop')

	startLoop()
})
