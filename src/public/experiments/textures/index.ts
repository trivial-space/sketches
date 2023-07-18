import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import { events, Q } from './context'
import { scene, noiseTex2, lineTex, noiseLayer } from './renderer'

addToLoop(() => {
	Q.emit(events.FRAME)
	Q.painter
		.compose(noiseTex2, noiseLayer, lineTex, scene.mirrorScene, scene.scene)
		.show(scene.scene)
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
