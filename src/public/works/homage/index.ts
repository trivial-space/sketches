import '../../../shared-utils/css/fullscreen.css'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import { events, Q } from './context'
import {
	mirrorScene,
	scene,
	videoLights,
	videoTextureData,
	videoTextures,
} from './renderer'
import { videos } from './state/videos'

const d = Q.get('device')
// d.sizeMultiplier = 1.5

videos.then((vs) => {
	function startVideos() {
		vs.forEach((v) => {
			v.muted = false
			v.play()
		})
		d.canvas.removeEventListener('mousedown', startVideos)
		d.canvas.removeEventListener('touchstart', startVideos)
	}
	d.canvas.addEventListener('mousedown', startVideos)
	d.canvas.addEventListener('touchstart', startVideos)

	addToLoop(() => {
		Q.emit(events.FRAME)
		videoTextures.forEach((t, i) =>
			t.update({ texture: { ...videoTextureData, asset: vs[i] } }),
		)
		Q.painter.compose(...videoLights, mirrorScene, scene)
	}, 'render')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
