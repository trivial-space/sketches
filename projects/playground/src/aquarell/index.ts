import { repeat } from '../shared-utils/scheduler'
import { events, Q } from './context'
import './paint'
import { automaton } from './renderer'

repeat((tpf) => {
	Q.get('device').tpf = tpf
	Q.emit(events.PROCESS_PAINT)
	Q.emit(events.FRAME)
	Q.painter.compose(automaton).display(automaton)
	Q.emit(events.CLEANUP_PAINT)
}, 'loop')

import.meta.webpackHot?.accept()
