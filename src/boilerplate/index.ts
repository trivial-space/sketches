import { dispatch, get } from 'shared-utils/painterState'
import { repeat } from 'shared-utils/scheduler'
import { events, painter } from './context'
import { scene } from './renderer'
import './state'
import './viewport'


repeat(tpf => {
	get('device').tpf = tpf
	dispatch(events.FRAME)
	painter.compose(scene)
}, 'loop')
