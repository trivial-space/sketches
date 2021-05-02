import {
	addToLoop,
	initKeyboardLoopToggle,
	startLoop,
} from '../../shared-utils/frameLoop'
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
		vs.forEach((v) => v.play())
		d.canvas.removeEventListener('mousedown', startVideos)
		d.canvas.removeEventListener('touchstart', startVideos)
	}
	d.canvas.addEventListener('mousedown', startVideos)
	d.canvas.addEventListener('touchstart', startVideos)

	addToLoop((tpf) => {
		d.tpf = tpf
		Q.emit(events.FRAME)
		videoTextures.forEach((t, i) =>
			t.update({ texture: { ...videoTextureData, asset: vs[i] } }),
		)
		Q.painter.compose(...videoLights, mirrorScene, scene).display(scene)
	}, 'render')

	startLoop()
})

import.meta.hot?.accept()
