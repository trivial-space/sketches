import './state'

import { repeat } from '../../shared-utils/scheduler'
import { events, Q } from './context'
import { scene } from './renderer'

repeat((tpf) => {
	Q.state.device.tpf = tpf
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
}, 'loop')

if (import.meta.hot) {
	import.meta.hot.accept()
}
