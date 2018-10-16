import { mat4 } from 'gl-matrix'
import { addSystem, getEffectLayer, getStaticLayer, set } from 'shared-utils/painterState'
import { makeClear } from 'tvs-painter/dist/lib/utils/context'
import { plane } from 'tvs-painter/dist/lib/utils/geometry/plane'
import { events, gl, paint, painter, State, state } from './context'
import base from './glsl/base.frag'
import planeFrag from './glsl/plane-material.frag'
import planeVert from './glsl/plane-material.vert'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1]
})

// ===== layers =====

const paintLayer = getStaticLayer(painter, 'paint')

const bufferSize = 256
const layer1 = getEffectLayer(painter, 'layer1')
	.update({
		buffered: true,
		flipY: true,
		width: bufferSize,
		height: bufferSize,
		frag: base,
		drawSettings: {
			disable: [gl.DEPTH_TEST]
		}
	})

const layer2 = getEffectLayer(painter, 'layer2')
	.update({
		buffered: true,
		flipY: true,
		width: bufferSize,
		height: bufferSize,
		frag: base,
		drawSettings: {
			disable: [gl.DEPTH_TEST]
		},
		uniforms: {
			size: bufferSize,
			paint: () => paintLayer.texture(),
			previous: () => layer1.texture()
		}
	})

layer1.update({
	uniforms: {
		size: bufferSize,
		paint: () => paintLayer.texture(),
		previous: () => layer2.texture()
	}
})

export const finalLayer = getEffectLayer(painter, 'final')
.update({
	uniforms: {
		source: () => state.renderer.currentLayer.texture()
	}
})

// ===== scene =====

const planMat = mat4.fromTranslation(mat4.create(), [0, 0, -3])
const rotation = 0.001
const projection = mat4.perspective(mat4.create(), 45, 1, 0.01, 10)


const form = painter.createForm().update(plane(2, 2))

const shade = painter.createShade().update({
	vert: planeVert,
	frag: planeFrag
})

const sketch = painter.createSketch().update({
	form, shade,
	uniforms: {
		transform: () => mat4.rotateY(planMat, planMat, rotation),
		tex: () => state.renderer.currentLayer.texture()
	}
})


export const planeLayer = painter.createDrawingLayer().update({
	sketches: [sketch],
	uniforms: {
		projection
	},
	drawSettings: {
		clearColor: [0.0, 1.0, 0.0, 1.0],
		clearBits: makeClear(gl, 'color', 'depth')
	}
})

// ===== state =====

export class RenderState {
	currentLayer = layer1

	switch = true
	swapLayers () {
		this.switch = !this.switch
		this.currentLayer = this.switch ? layer1 : layer2
	}
}

set<State>('renderer', new RenderState())

addSystem<State>('renderer', (e, s) => {
	if (e === events.FRAME) {
		s.renderer.swapLayers()
		paintLayer.update({ asset: paint })
	}
})
