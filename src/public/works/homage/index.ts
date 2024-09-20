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

videos.forEach((vp, i) =>
	vp.then(async (v) => {
		function startVideo() {
			if (!(v.currentTime > 0) && v.readyState > 2) {
				v.play()
				d.canvas.removeEventListener('mousedown', startVideo)
				d.canvas.removeEventListener('touchstart', startVideo)
			}
		}
		d.canvas.addEventListener('mousedown', startVideo)
		d.canvas.addEventListener('touchstart', startVideo)

		videoTextures[i].update({
			width: 0,
			height: 0,
			texture: { ...videoTextureData, asset: v },
		})

		Q.listen('video' + i, events.FRAME, () => {
			videoTextures[i].update({ texture: { asset: v } })
		})
	}),
)

addToLoop(() => {
	Q.emit(events.FRAME)
	Q.painter.compose(...videoLights, mirrorScene, scene)
}, 'render')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
