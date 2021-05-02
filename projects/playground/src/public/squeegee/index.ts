import './state'
import { repeat } from '../../shared-utils/scheduler'
import { events, Q } from './context'
import { scene } from './renderer'

Q.state.device.sizeMultiplier = window.devicePixelRatio

repeat((tpf) => {
	Q.state.device.tpf = Math.min(tpf, 60)
	Q.emit(events.FRAME)
	Q.painter.compose(scene).display(scene)
}, 'loop')

Q.listen('index', events.RESIZE, () => {
	scene.update()
})

import.meta.hot?.accept()
