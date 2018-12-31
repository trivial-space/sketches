import {
	addSystem,
	getEffect,
	getFrame,
	set,
} from 'shared-utils/painterState'
import { LayerData } from 'tvs-painter'
import { events, gl, paint, painter, State, state } from './context'
import base from './glsl/base.frag'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
})

// ===== layers =====

const paintLayer = getFrame(painter, 'paint')

const bufferSize = 256
const layerOptions: LayerData = {
	buffered: true,
	flipY: true,
	width: bufferSize,
	height: bufferSize,
	frag: base,
	// textureConfig: {
	// 	count: 2,
	// 	type: gl.FLOAT
	// },
	drawSettings: {
		disable: [gl.DEPTH_TEST],
	},
}

const layer1 = getEffect(painter, 'layer1')

const layer2 = getEffect(painter, 'layer2').update({
	...layerOptions,
	uniforms: {
		size: bufferSize,
		paint: () => paintLayer.texture(),
		previous: () => layer1.texture(),
	},
})

layer1.update({
	...layerOptions,
	uniforms: {
		size: bufferSize,
		paint: () => paintLayer.texture(),
		previous: () => layer2.texture(),
	},
})

export const finalLayer = getEffect(painter, 'final').update({
	uniforms: {
		source: () => state.renderer.currentLayer.texture(),
	},
})

// ===== state =====

export class RenderState {
	currentLayer = layer1

	switch = true
	swapLayers() {
		this.switch = !this.switch
		this.currentLayer = this.switch ? layer1 : layer2
	}
}

set<State>('renderer', new RenderState(), { reset: true })

addSystem<State>('renderer', (e, s) => {
	if (e === events.FRAME) {
		s.renderer.swapLayers()
		paintLayer.update({ asset: paint })
	}
})
