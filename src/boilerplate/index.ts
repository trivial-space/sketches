import './camera'
import './state'
import { repeat } from 'shared-utils/scheduler'
import { scene } from './renderer'
import { painter, events } from './context'
import { get, dispatch } from 'shared-utils/painterState'


repeat(tpf => {
	get('device').tpf = tpf / 60
	dispatch(events.FRAME)
	painter.compose(scene)
}, 'loop')


if (module.hot) {
	module.hot.accept()
}
