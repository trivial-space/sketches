import { addSystem, set } from '../shared-utils/painterState'
import {
	PerspectiveCamera,
	WithKeyNavigation,
	WithMouseRotation,
} from '../shared-utils/vr/camera'
import { events, State } from './context'

export class ViewPort {
	moveSpeed = 0.04
	lookSpeed = 0.003
	camera = new (WithKeyNavigation(WithMouseRotation(PerspectiveCamera)))({
		fovy: Math.PI * 0.3,
		position: [0, 0, 5],
	})
}

addSystem<State>('viewPort', (e, s) => {
	const v = s.viewPort
	switch (e) {
		case events.FRAME:
			const tpf = s.device.tpf / 60
			v.camera.updatePosFromKeys(v.moveSpeed * tpf, s.device.keys)
			v.camera.updateRotFromMouse(v.lookSpeed * tpf, s.device.mouse)
			v.camera.update()
			return

		case events.RESIZE:
			v.camera.aspect = s.device.canvas.width / s.device.canvas.height
			v.camera.needsUpdateProjection = true
	}
})

set<State>('viewPort', new ViewPort(), {
	reset: { moveSpeed: true, lookSpeed: true },
})