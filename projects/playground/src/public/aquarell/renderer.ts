import { events, paint, Q } from './context'
import base from './glsl/base.frag.glsl'

// ===== layers =====

const paintLayer = Q.getFrame('paint')

const bufferSize = 256

const layer = Q.getEffect('layer').update({
	frag: base,
	uniforms: {
		size: bufferSize,
		paint: () => paintLayer.image(),
		previous: () => '0',
	},
})

export const automaton = Q.getFrame('automaton').update({
	layers: layer,
	width: bufferSize,
	height: bufferSize,
	selfReferencing: true,
	bufferStructure: [
		{
			flipY: true,
		},
	],
})

// ===== state =====

Q.listen('renderer', events.FRAME, () => {
	paintLayer.update({ texture: { asset: paint } })
})
