import './state/tiles'
import './viewport'

import { addSystem, dispatch } from 'shared-utils/painterState'
import { repeat } from 'shared-utils/scheduler'
import { events, painter, State } from './context'
import { tiles } from './renderer'

// state.device.sizeMultiplier = window.devicePixelRatio

addSystem<State>('start', (e, s) => {
	if (e === events.ON_IMAGES_LOADED) {
		repeat(tpf => {
			s.device.tpf = tpf
			dispatch(events.FRAME)
			painter.draw(tiles)
		}, 'loop')
	}
})

dispatch(events.INIT)
