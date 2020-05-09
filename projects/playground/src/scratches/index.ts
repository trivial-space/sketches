import './state'
import { repeat } from '../shared-utils/scheduler'
import { get, dispatch, addSystem } from '../shared-utils/painterState'
import { events, painter, state } from './context'
import { scene } from './renderer'

state.time = 0
state.device.sizeMultiplier = window.devicePixelRatio

// repeat((tpf) => {
// 	state.device.tpf = tpf
// 	state.time += tpf / 1000
// 	dispatch(events.FRAME)
// 	painter.compose(scene).display(scene)
// }, 'loop')

addSystem('index', (e) => {
	if (e === events.RESIZE) {
		scene.update()
		painter.compose(scene).display(scene)
		console.log(scene._targets[0].width, painter.gl.drawingBufferWidth)
	}
})
