import { dispatch, get } from 'shared-utils/painterState'
import { repeat } from 'shared-utils/scheduler'
import { events, painter, state } from './context'
import './paint'
import './renderer'
import { finalLayer } from './renderer'


repeat(tpf => {
	get('device').tpf = tpf
	dispatch(events.PROCESS_PAINT)
	dispatch(events.FRAME)
	painter.compose(state.renderer.currentLayer, finalLayer)
	dispatch(events.CLEANUP_PAINT)
}, 'loop')
