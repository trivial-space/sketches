import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import '../../../shared-utils/css/fullscreen.css'
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

const loadingMessage = document.getElementById('loading-message')
videos
	.then((vs) => {
		loadingMessage!.remove()
		function startVideos() {
			vs.forEach((v) => {
				if (!(v.currentTime > 0 && !v.paused && !v.ended && v.readyState > 2)) {
					v.play()
				}
				v.muted = false
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
	.catch((e) => {
		loadingMessage!.textContent =
			'Something went wrong, failed to load videos :('
		console.error('Failed to load videos', e)
	})

if (import.meta.hot) {
	import.meta.hot.accept()
}
