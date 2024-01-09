import '../../../shared-utils/css/fullscreen.css'
import './state'

import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import { events, Q } from './context'
import { light, scene } from './renderer'

addToLoop(() => {
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
	Q.painter.draw({ effects: light })
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
