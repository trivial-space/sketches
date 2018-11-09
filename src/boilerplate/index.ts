import './state'
import './viewport'

import { dispatch, get } from 'shared-utils/painterState'
import { repeat } from 'shared-utils/scheduler'
import { events, painter } from './context'
import { scene } from './renderer'

repeat(tpf => {
	get('device').tpf = tpf
	dispatch(events.FRAME)
	painter.compose(scene)
}, 'loop')
