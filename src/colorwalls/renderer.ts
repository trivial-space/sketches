import * as init from './state'
import { camera } from './camera'
import { gl, painter } from './context'
import { getSketch, getDrawingLayer } from 'shared-utils/painterState'
import { wallsForm, groundForm } from 'colorwalls/geometries'
import { baseShade, groundShade } from 'colorwalls/shaders'


// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
	enable: [gl.DEPTH_TEST]
})


// ===== objects =====

export const wallsSketch = getSketch(painter, 'wallsSketch')
	.update({
		form: wallsForm,
		shade: baseShade,
		uniforms: {
			transform: init.wallsTransform
		}
	})


export const groundSketch = getSketch(painter, 'groundSketch')
	.update({
		form: groundForm,
		shade: groundShade,
		uniforms: {
			transform: init.floorTransform
		}
	})


// ===== layers =====

export const scene = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [groundSketch, wallsSketch],
		uniforms: {
			view: camera.state.view,
			projection: camera.state.perspective
		},
		drawSettings: {
			clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
		}
	})


if (module.hot) {
	module.hot.accept()
}

