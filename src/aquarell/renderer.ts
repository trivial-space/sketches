import { addSystem, getEffect, getFrame } from 'shared-utils/painterState'
import { events, paint, painter } from './context'
import base from './glsl/base.frag'

// ===== layers =====

const paintLayer = getFrame(painter, 'paint')

const bufferSize = 256

const layer = getEffect(painter, 'layer').update({
	frag: base,
	uniforms: {
		size: bufferSize,
		paint: () => paintLayer.image(),
		previous: () => '0',
	},
})

export const automaton = getFrame(painter, 'automaton').update({
	layers: layer,
	flipY: true,
	width: bufferSize,
	height: bufferSize,
	selfReferencing: true,
})

// ===== state =====

addSystem('renderer', e => {
	if (e === events.FRAME) {
		paintLayer.update({ asset: paint })
	}
})
