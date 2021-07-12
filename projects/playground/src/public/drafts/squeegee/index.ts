import './state'
import { events, Q } from './context'
import { scene } from './renderer'
import { addToLoop, startLoop } from '../../../shared-utils/frameLoop'

Q.state.device.sizeMultiplier = window.devicePixelRatio

addToLoop((tpf) => {
	Q.state.device.tpf = Math.min(tpf, 60)
	Q.emit(events.FRAME)
	Q.painter.compose(scene).display(scene)
}, 'loop')

Q.listen('index', events.RESIZE, () => {
	scene.update()
})

startLoop()

import.meta.hot?.accept()
