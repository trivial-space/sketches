import './state/tiles'
import './viewPort'
import { repeat } from 'shared-utils/scheduler'
import { painter, events, State } from './context'
import { scene } from './renderer'
import { addSystem, dispatch } from 'shared-utils/painterState'


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
