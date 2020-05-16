import './state'
import { repeat } from '../shared-utils/scheduler'
import { get, dispatch, addSystem } from '../shared-utils/painterState'
import { events, painter, state } from './context'
import { scene } from './renderer'

state.device.sizeMultiplier = window.devicePixelRatio

repeat((tpf) => {
	state.device.tpf = Math.min(tpf, 60)
	dispatch(events.FRAME)
	painter.compose(scene).display(scene)
}, 'loop')

addSystem('index', (e) => {
	if (e === events.RESIZE) {
		scene.update()
	}
})
