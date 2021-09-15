import { events, Q } from './context'
import { repeat } from '../../../shared-utils/scheduler'
import { scene, noiseTex, noiseTex2, lineTex } from './renderer'

repeat((tpf) => {
	Q.state.device.tpf = tpf
	Q.emit(events.FRAME)
	Q.painter
		.compose(noiseTex, noiseTex2, lineTex, scene.mirrorScene, scene.scene)
		.show(scene.scene)
}, 'loop')

import.meta.hot?.accept()
