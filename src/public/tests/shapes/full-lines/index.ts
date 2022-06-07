import './state'
import { events, Q } from './context'
import { scene } from './renderer'
import { addToLoop, startLoop } from 'tvs-utils/src/app/frameLoop'

Q.state.time = 0

addToLoop((tpf) => {
	Q.state.device.tpf = tpf
	Q.state.time += tpf / 1000
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
