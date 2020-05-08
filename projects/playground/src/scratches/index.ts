import './state'
import { repeat } from '../shared-utils/scheduler'
import { get, dispatch } from '../shared-utils/painterState'
import { events, painter, state } from './context'
import { scene } from './renderer'

state.time = 0

repeat((tpf) => {
	state.device.tpf = tpf
	state.time += tpf / 1000
	dispatch(events.FRAME)
	painter.compose(scene).display(scene)
}, 'loop')
