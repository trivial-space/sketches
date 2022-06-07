import './state'

import { repeat } from 'tvs-utils/src/app/scheduler'
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
