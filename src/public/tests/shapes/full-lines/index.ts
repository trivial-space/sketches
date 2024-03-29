import './state'
import { addToLoop, startLoop } from '../../../../shared-utils/app/frameLoop'
import { events, Q } from './context'
import { scene } from './renderer'

Q.state.time = 0

addToLoop((tpf) => {
	Q.state.time += tpf / 1000
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
