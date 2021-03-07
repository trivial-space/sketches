import { events, Q } from './context'
import { repeat } from '../../shared-utils/scheduler'
import { scene, noiseFrame, noiseTex2Frame, lineTexFrame } from './renderer'

repeat((tpf) => {
	Q.state.device.tpf = tpf
	Q.emit(events.FRAME)
	Q.painter
		.compose(noiseFrame, noiseTex2Frame, lineTexFrame, scene)
		.display(scene)
}, 'loop')

import.meta.webpackHot?.accept()
