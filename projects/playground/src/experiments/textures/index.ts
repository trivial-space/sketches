import {
	getEffect,
	get,
	dispatch,
	getFrame,
	addSystem,
} from '../../shared-utils/painterState'
import { painter, events } from './context'
import { noiseShader } from './shaders'
import { repeat } from '../../shared-utils/scheduler'

// ===== layers =====

export const noise = getEffect(painter, 'noise').update({
	frag: noiseShader,
})

export const toNormal = getEffect(painter, 'toNormal')

const noiseFrame = getFrame(painter, 'noise').update({
	layers: noise,
})

let time = 0

repeat(tpf => {
	const d = get('device')
	d.tpf = tpf
	// dispatch(events.FRAME)

	time += tpf / 10000
	noise.update({
		uniforms: {
			resolution: [d.canvas.width, d.canvas.height],
			time,
		},
	})
	painter.compose(noiseFrame).display(noiseFrame)
}, 'loop')

addSystem('index', (e, s) => {
	if (e === events.RESIZE) {
		noiseFrame.update()
	}
})
