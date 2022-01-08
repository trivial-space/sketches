import './state'
import { repeat } from '../../../../shared-utils/scheduler'
import { events, Q } from './context'
import { scene } from './renderer'

Q.state.time = 0
Q.state.device.sizeMultiplier = window.devicePixelRatio

// repeat((tpf) => {
// 	state.device.tpf = tpf
// 	state.time += tpf / 1000
// 	dispatch(events.FRAME)
// 	painter.compose(scene).display(scene)
// }, 'loop')

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
	console.log(scene._targets[0].width, Q.gl.drawingBufferWidth)
})

import.meta.hot?.accept()
