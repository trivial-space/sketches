import './state'

import { repeat } from 'tvs-utils/src/app/scheduler'
import { events, Q } from './context'
import { light, scene } from './renderer'

repeat((tpf) => {
	Q.get('device').tpf = tpf
	Q.emit(events.FRAME)
	Q.painter.compose(scene)
	Q.painter.draw({ effects: light })
}, 'loop')

if (import.meta.hot) {
	import.meta.hot.accept()
}
