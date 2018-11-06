import './context'
import './state/tiles'
import './viewport'

import { addSystem, dispatch } from 'shared-utils/painterState'
import { repeat } from 'shared-utils/scheduler'
import { events, painter, State } from './context'
import { scene } from './renderer'

// state.device.sizeMultiplier = window.devicePixelRatio


addSystem<State>('start', (e, s) => {
	if (e === events.START) {
		repeat(tpf => {
			s.device.tpf = tpf
			dispatch(events.FRAME)
			painter.compose(scene)
		}, 'loop')
	}
})

dispatch(events.INIT)
