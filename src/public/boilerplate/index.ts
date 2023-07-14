import './state'

import { events, Q } from './context'
import { scene } from './renderer'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'

addToLoop((tpf) => {
	Q.state.device.tpf = tpf
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
