import './state'

import { repeat } from '../shared-utils/scheduler'
import { events, Q } from './context'
import { main } from './renderer'

repeat((tpf) => {
	Q.state.device.tpf = tpf
	Q.emit(events.FRAME)
	Q.painter.compose(main).display(main)
}, 'loop')
