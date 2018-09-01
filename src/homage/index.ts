import './viewport'
import './state/ground'
import './state/screens'
import { repeat } from 'shared-utils/scheduler'
import { painter, events } from './context'
import { layers, videoTextures } from './renderer'
import { videos } from './state/videos'
import { get, dispatch } from 'shared-utils/painterState'


videos.then(vs => {
	repeat(tpf => {
		get('device').tpf = tpf
		dispatch(events.FRAME)
		videoTextures.forEach((t, i) => t.update({ asset: vs[i] }))
		painter.compose.apply(painter, layers)
	}, 'render')
})
