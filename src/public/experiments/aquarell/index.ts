import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import { events, Q } from './context'
import './paint'
import { automaton } from './renderer'

addToLoop(() => {
	Q.emit(events.PROCESS_PAINT)
	Q.emit(events.FRAME)
	Q.painter.compose(automaton).show(automaton)
	Q.emit(events.CLEANUP_PAINT)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
