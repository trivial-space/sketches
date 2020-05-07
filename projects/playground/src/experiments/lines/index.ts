import { repeat } from '../../shared-utils/scheduler'
import { get, dispatch } from '../../shared-utils/painterState'
import { events, painter } from './context'
import { scene } from './renderer'

repeat(tpf => {
	get('device').tpf = tpf
	dispatch(events.FRAME)
	painter.compose(scene).display(scene)
}, 'loop')
