import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import { events, Q } from './context'
import { scene } from './renderer'

addToLoop(() => {
	Q.emit(events.FRAME)
	Q.painter.compose(scene.mirrorScene, scene.scene)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
