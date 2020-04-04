import {
	getFrame,
	getLayer,
	getShade,
	getSketch,
} from '../shared-utils/painterState'
import { gl, painter, state } from './context'
import { planeForm } from './geometries'
import frag from './glsl/base.frag'
import vert from './glsl/base.vert'

// ===== shaders =====

export const baseShade = getShade(painter, 'base').update({ vert, frag })

// ===== objects =====

const sketch = getSketch(painter, 'quad').update({
	form: planeForm,
	shade: baseShade,
	uniforms: { transform: () => state.entities.quad.transform },
})

// ===== layers =====

const scene = getLayer(painter, 'scene').update({
	sketches: [sketch],
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat,
	},
	drawSettings: {
		clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT,
	},
})

export const main = getFrame(painter, 'main').update({
	layers: scene,
})
