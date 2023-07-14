import './state'

import { events, Q } from './context'
import { light, scene } from './renderer'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'

addToLoop((tpf) => {
	Q.get('device').tpf = tpf
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
	Q.painter.draw({ effects: light })
}, 'loop')

startLoop

if (import.meta.hot) {
	import.meta.hot.accept()
}
