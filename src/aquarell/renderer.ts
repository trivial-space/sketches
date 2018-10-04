import { addSystem, getEffectLayer, set } from 'shared-utils/painterState'
import { events, painter, State } from './context'


// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1]
})

// ===== layers =====

const layer1 = getEffectLayer(painter, 'layer1')
	.update({
		buffered: true
	})

const layer2 = getEffectLayer(painter, 'layer2')
	.update({
		buffered: true
	})

export const reveal = getEffectLayer(painter, 'reveal')

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
	}
})
