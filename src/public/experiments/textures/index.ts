import { events, Q } from './context'
import { repeat } from 'tvs-utils/src/app/scheduler'
import { scene, noiseTex2, lineTex, noiseLayer } from './renderer'

repeat((tpf) => {
	Q.state.device.tpf = tpf
	Q.emit(events.FRAME)
	Q.painter
		.compose(noiseTex2, noiseLayer, lineTex, scene.mirrorScene, scene.scene)
		.show(scene.scene)
}, 'loop')

if (import.meta.hot) {
	import.meta.hot.accept()
}
