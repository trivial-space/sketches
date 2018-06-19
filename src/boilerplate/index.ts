import { repeat } from 'shared-utils/scheduler'
import * as cam from 'tvs-utils/dist/lib/vr/camera'
import { camera, lookSpeed, moveSpeed } from './camera'
import { painter } from './context'
import { scene } from './renderer'
import { keyboard, mouse } from './events'


repeat(tpf => {
	cam.updateRotFromMouse(camera, lookSpeed, mouse.state)
	const speed = moveSpeed * tpf / 16
	cam.updatePosFromKeys(camera, speed, keyboard.state.pressed)
	cam.update(camera)
	painter.compose(scene)
}, 'render')


if (module.hot) {
	module.hot.accept()
}
