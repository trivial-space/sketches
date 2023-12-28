import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
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
