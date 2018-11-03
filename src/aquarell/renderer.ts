import { addSystem, getEffectLayer, getStaticLayer, set } from 'shared-utils/painterState'
import { events, gl, paint, painter, State, state } from './context'
import base from './glsl/base.frag'

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

// ===== state =====

export class RenderState {
	currentLayer = layer1

	switch = true
	swapLayers () {
		this.switch = !this.switch
		this.currentLayer = this.switch ? layer1 : layer2
	}
}

set<State>('renderer', new RenderState(), {reset: true})

addSystem<State>('renderer', (e, s) => {
	if (e === events.FRAME) {
		s.renderer.swapLayers()
		paintLayer.update({ asset: paint })
	}
})
