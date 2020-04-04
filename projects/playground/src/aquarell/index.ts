import { dispatch, get } from '../shared-utils/painterState'
import { repeat } from '../shared-utils/scheduler'
import { events, painter } from './context'
import './paint'
import { automaton } from './renderer'

repeat(tpf => {
	get('device').tpf = tpf
	dispatch(events.PROCESS_PAINT)
	dispatch(events.FRAME)
	painter.compose(automaton).display(automaton)
	dispatch(events.CLEANUP_PAINT)
}, 'loop')
