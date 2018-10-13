import {
	addSystem,
	getEffectLayer,
	getStaticLayer,
	set
} from 'shared-utils/painterState'
import { events, paint, painter, State } from './context'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1]
})

// ===== layers =====

const paintLayer = getStaticLayer(painter, 'paint')
.update({
	asset: paint
})

const layer1 = getEffectLayer(painter, 'layer1')
.update({
	buffered: true
})

const layer2 = getEffectLayer(painter, 'layer2')
.update({
	buffered: true,
	uniforms: {
		paint: paintLayer.texture(),
		previous: layer1.texture()
	}
})

layer1.update({
	uniforms: {
		paint: paintLayer.texture(),
		previous: layer1.texture()
	}
})

export const reveal = getEffectLayer(painter, 'reveal')

// ===== state =====

export class RenderState {
	currentLayer = layer1

	switch = true
	swapLayers() {
		this.switch = !this.switch
		this.currentLayer = this.switch ? layer1 : layer2
	}
}

set<State>('renderer', new RenderState())

addSystem<State>('renderer', (e, s) => {
	if (e === events.FRAME) {
		s.renderer.swapLayers()
	}
})
