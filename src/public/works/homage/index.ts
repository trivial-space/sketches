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
d.sizeMultiplier = window.devicePixelRatio

videos.forEach((vp, i) =>
	vp.then(async (v) => {
		videoTextures[i].update({
			width: 0,
			height: 0,
			texture: { ...videoTextureData, asset: v },
		})

		Q.listen('video' + i, events.FRAME, () => {
			videoTextures[i].update({ texture: { asset: v } })

			if (v.readyState > 3 && (v.currentTime < 0.1 || v.paused)) {
				function startVideo() {
					v.play()
					d.canvas.removeEventListener('mousedown', startVideo)
					d.canvas.removeEventListener('touchstart', startVideo)
				}
				d.canvas.addEventListener('mousedown', startVideo)
				d.canvas.addEventListener('touchstart', startVideo)
			}
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
