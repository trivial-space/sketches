import { repeat } from '../../shared-utils/scheduler'
import { events, Q } from './context'
import './paint'
import { automaton, sketch } from './renderer'

repeat((tpf) => {
	Q.get('device').tpf = tpf
	Q.emit(events.PROCESS_PAINT)
	Q.emit(events.FRAME)
	Q.painter.compose(automaton)
	Q.painter.draw(sketch)
	Q.emit(events.CLEANUP_PAINT)
}, 'loop')
