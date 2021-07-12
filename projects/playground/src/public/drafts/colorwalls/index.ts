import { repeat } from '../../../shared-utils/scheduler'
import { events, Q } from './context'
import { scene } from './renderer'

repeat((tpf) => {
	Q.get('device').tpf = tpf
	Q.emit(events.FRAME)
	Q.painter.compose(scene).display(scene)
}, 'loop')

import.meta.hot?.accept()
