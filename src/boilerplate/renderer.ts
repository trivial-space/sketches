import { gl, painter, state } from './context'
import { getSketch, getDrawingLayer } from 'shared-utils/painterState'
import { planeForm } from './geometries'
import { baseShade } from './shaders'


// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
	enable: [gl.DEPTH_TEST]
})


// ===== objects =====

const sketch = getSketch(painter, 'quad')
	.update({
		form: planeForm,
		shade: baseShade,
		uniforms: { transform: state.entities.quad.transform }
	})


// ===== layers =====

export const scene = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [sketch],
		uniforms: {
			view: state.viewPort.camera.viewMat,
			projection: state.viewPort.camera.projectionMat
		},
		drawSettings: {
			clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
		}
	})


if (module.hot) {
	module.hot.accept()
}
