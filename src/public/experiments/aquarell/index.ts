import { repeat } from 'tvs-utils/src/app/scheduler'
import { events, Q } from './context'
import './paint'
import { automaton } from './renderer'

repeat((tpf) => {
	Q.get('device').tpf = tpf
	Q.emit(events.PROCESS_PAINT)
	Q.emit(events.FRAME)
	Q.painter.compose(automaton).show(automaton)
	Q.emit(events.CLEANUP_PAINT)
}, 'loop')

if (import.meta.hot) {
	import.meta.hot.accept()
}
