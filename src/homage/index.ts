import './viewport'
import './state/ground'
import './state/screens'
import { repeat } from 'shared-utils/scheduler'
import { painter, events } from './context'
import { layers, videoTextures } from './renderer'
import { videos } from './state/videos'
import { get, dispatch } from 'shared-utils/painterState'


const tickStep = 2
let tickCounter = 0

videos.then(vs => {
	repeat(tpf => {
		get('device').tpf = tpf
		dispatch(events.FRAME)

		if (tickCounter === 0) {
			videoTextures.forEach((t, i) => t.update({ asset: vs[i] }))
		}
		tickCounter = tickCounter === tickStep ? 0 : tickCounter + 1

		painter.compose.apply(painter, layers)
	}, 'render')
})
