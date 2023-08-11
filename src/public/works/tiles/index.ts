import '../../../shared-utils/css/fullscreen.css'
import './state/tiles'
import './viewport'

import { events, Q } from './context'
import { tiles } from './renderer'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'

Q.state.device.sizeMultiplier = window.devicePixelRatio

addToLoop(() => {
	Q.emit(events.FRAME)
	Q.painter.draw({ sketches: tiles })
}, 'loop')

Q.listen('start', events.ON_IMAGES_LOADED, () => {
	startLoop()
})

Q.emit(events.INIT)

if (import.meta.hot) {
	import.meta.hot.accept()
}
