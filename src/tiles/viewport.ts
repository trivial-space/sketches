import { PerspectiveCamera } from 'shared-utils/vr/camera'
import { set, addSystem } from 'shared-utils/painterState'
import { events, State } from './context'


export class ViewPort {
	distance = 103
	camera = new PerspectiveCamera({
		fovy: Math.PI * 0.3,
		position: [0, 0, 0]
	})
}


addSystem<State>('viewPort', (e, s) => {
	const v = s.viewPort
	switch (e) {

		case events.RESIZE:
			const cam = v.camera
 			v.distance = s.tiles.colCount * s.tiles.tileSize * 0.47
			cam.aspect = s.device.canvas.width / s.device.canvas.height
			cam.needsUpdateProjection = true
			cam.position = [0, 0, v.distance / cam.aspect]
			cam.needsUpdateView = true
			cam.update()
	}
})


set<State>('viewPort', new ViewPort(), {reset: {moveSpeed: true, lookSpeed: true}})
