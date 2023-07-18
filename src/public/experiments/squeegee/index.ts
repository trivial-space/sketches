import './state'
import { events, Q } from './context'
import { scene } from './renderer'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'

Q.state.device.sizeMultiplier = window.devicePixelRatio

addToLoop((tpf) => {
	Q.state.device.tpf = Math.min(tpf, 60)
	Q.emit(events.FRAME)
	Q.painter.compose(scene).show(scene)
}, 'loop')

Q.listen('index', events.RESIZE, () => {
	scene.update()
})

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
