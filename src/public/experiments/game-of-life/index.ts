import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import { events, Q } from './context'
import './paint'
import { automaton, sketch } from './renderer'

addToLoop(() => {
	Q.emit(events.PROCESS_PAINT)
	Q.emit(events.FRAME)
	Q.painter.compose(automaton)
	Q.painter.draw({ sketches: sketch })
	Q.emit(events.CLEANUP_PAINT)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
