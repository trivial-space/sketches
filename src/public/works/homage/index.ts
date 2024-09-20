import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import '../../../shared-utils/css/fullscreen.css'
import { events, Q } from './context'
import { mirrorScene, scene, videoLights, videoTextures } from './renderer'
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

		await new Promise<void>((res) => {
			setTimeout(() => {
				res()
			}, Math.random() * 5000)
		})
		videoTextures[i].update({
			width: 0,
			height: 0,
		})

		addToLoop(() => {
			videoTextures[i].update({ texture: { asset: v } })
		}, 'video' + i)
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
