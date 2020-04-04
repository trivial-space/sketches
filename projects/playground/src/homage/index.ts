import './state/ground'
import './state/screens'
import './viewport'

import { dispatch, get } from '../shared-utils/painterState'
import { repeat } from '../shared-utils/scheduler'
import { events, painter } from './context'
import {
	mirrorScene,
	scene,
	videoLights,
	videoTextureData,
	videoTextures,
} from './renderer'
import { videos } from './state/videos'

const d = get('device')
d.sizeMultiplier = 1.5

videos.then(vs => {
	function startVideos() {
		vs.forEach(v => v.play())
		d.canvas.removeEventListener('mousedown', startVideos)
		d.canvas.removeEventListener('touchstart', startVideos)
	}
	d.canvas.addEventListener('mousedown', startVideos)
	d.canvas.addEventListener('touchstart', startVideos)

	repeat(tpf => {
		d.tpf = tpf
		dispatch(events.FRAME)
		videoTextures.forEach((t, i) =>
			t.update({ texture: { ...videoTextureData, asset: vs[i] } }),
		)
		painter.compose(...videoLights, mirrorScene, scene).display(scene)
	}, 'render')
})
