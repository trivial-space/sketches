import './state'
import { repeat } from '../../shared-utils/scheduler'
import { events, Q } from './context'
import { scene } from './renderer'

Q.state.time = 0

repeat((tpf) => {
	Q.state.device.tpf = tpf
	Q.state.time += tpf / 1000
	Q.emit(events.FRAME)
	Q.painter.compose(scene).display(scene)
}, 'loop')
