import './state'

import { repeat } from '../shared-utils/scheduler'
import { events, $ } from './context'
import { main } from './renderer'

repeat((tpf) => {
	$.state.device.tpf = tpf
	$.emit(events.FRAME)
	$.painter.compose(main).display(main)
}, 'loop')
