import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import '../../../shared-utils/css/fullscreen.css'
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
