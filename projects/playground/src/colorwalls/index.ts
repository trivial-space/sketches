import { dispatch, get } from '../shared-utils/painterState'
import { repeat } from '../shared-utils/scheduler'
import { events, painter } from './context'
import { main } from './renderer'

// const d = get('device')
// d.sizeMultiplier = 1.5

repeat(tpf => {
	get('device').tpf = tpf
	dispatch(events.FRAME)
	painter.compose(main).display(main)
}, 'loop')
