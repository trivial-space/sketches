import { get, dispatch } from '../../shared-utils/painterState'
import { painter, events, state } from './context'
import { repeat } from '../../shared-utils/scheduler'
import { scene, noiseFrame } from './renderer'

repeat(tpf => {
	const d = state.device
	d.tpf = tpf
	dispatch(events.FRAME)
	painter.compose(noiseFrame, scene).display(scene)
}, 'loop')
