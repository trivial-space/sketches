import { transform } from './state'
import { camera } from './camera'
import { gl, painter } from './context'
import { getSketch, getDrawingLayer } from 'shared-utils/painterState'
import { planeForm } from './geometries'
import { baseShade } from './shaders'


// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
	enable: [gl.DEPTH_TEST]
})


// ===== objects =====

const sketch = getSketch(painter, 'wallsSketch')
	.update({
		form: planeForm,
		shade: baseShade,
		uniforms: { transform }
	})


// ===== layers =====

export const scene = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [sketch],
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
