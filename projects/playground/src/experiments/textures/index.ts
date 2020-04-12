import { get, dispatch } from '../../shared-utils/painterState'
import { painter, events } from './context'
import { repeat } from '../../shared-utils/scheduler'
import { scene, noiseSketch, noiseFrame } from './renderer'

repeat(tpf => {
	const d = get('device')
	d.tpf = tpf
	dispatch(events.FRAME)
	painter.compose(noiseFrame)
	painter.draw(noiseSketch)
}, 'loop')
