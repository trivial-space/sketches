import {
	getForm,
	getShade,
	getSketch,
	getFrame,
	getLayer,
	addSystem,
} from '../shared-utils/painterState'
import { painter, State, events, state } from './context'
import { lineFrag, lineVert } from './shaders'
import { lineToTriangleStripGeometry } from '../shared-utils/geometry/lines'
import { getNoiseTextureData } from '../shared-utils/texture-helpers'
import { initPerspectiveViewport } from '../shared-utils/vr/perspectiveViewport'

initPerspectiveViewport({ position: [0, 0, 15] })

const shade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

const form = getForm(painter, 'line')

export const noiseTexFrame = getFrame(painter, 'noiseTex').update({
	texture: getNoiseTextureData({
		width: 256,
		height: 256,
		startX: 3,
		startY: 3,
		data: {
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
			wrap: 'REPEAT',
		},
	}),
})

const sketch = getSketch(painter, 'line').update({
	form: form,
	shade,
	uniforms: {
		noiseTex: noiseTexFrame.image(),
	},
})

// === scene ===

export const scene = getFrame(painter, 'scene').update({
	layers: getLayer(painter, 'scene').update({
		sketches: [sketch],
		uniforms: {
			view: () => state.viewPort.camera.viewMat,
			projection: () => state.viewPort.camera.projectionMat,
		},
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			// clearBits: painter.gl.COLOR_BUFFER_BIT,
			enable: [painter.gl.BLEND],
		},
	}),
})

addSystem<State>('renderer', (e, s) => {
	if (e === events.FRAME) {
		form.update(
			lineToTriangleStripGeometry(s.squeegee.line, 1, {
				storeType: 'DYNAMIC',
				withUVs: true,
			}),
		)
	}
})
