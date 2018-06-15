import { repeat } from 'shared-utils/scheduler'
import { update } from 'tvs-utils/dist/lib/vr/camera'
import { camera, groundMirrorView } from './camera'
import { painter } from './context'
import { layers, videoTextures } from './renderer'
import './events'
import { mat4 } from 'gl-matrix'
import { mirrorMatrix } from './state/ground'
import { videos } from './state/videos'


const tickStep = 2
let tickCounter = 0

videos.then(vs => {
	repeat(() => {
		update(camera)
		mat4.multiply(groundMirrorView, camera.state.view, mirrorMatrix as any)

		if (tickCounter === 0) {
			videoTextures.forEach((t, i) => t.update({
				asset: vs[i]
			}))
		}
		tickCounter = tickCounter === tickStep ? 0 : tickCounter + 1

		painter.compose.apply(null, layers)
	}, 'render')
})


if (module.hot) {
	module.hot.accept()
}
