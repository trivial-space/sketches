import '../../shared-utils/css/fullscreen.css'
import './state'

import { events, Q } from './context'
import { scene } from './renderer'
import { addToLoop, startLoop } from '../../shared-utils/app/frameLoop'

addToLoop(() => {
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
