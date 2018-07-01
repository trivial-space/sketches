import './events'
import './camera'
import './state'
import { repeat } from 'shared-utils/scheduler'
import { scene } from './renderer'
import { state, painter } from './context'


repeat(tpf => {
	state.viewPort.update(tpf)
	state.entities.update(tpf)
	painter.compose(scene)
}, 'loop')


if (module.hot) {
	module.hot.accept()
}
