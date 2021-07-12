import { mat4, quat } from 'gl-matrix'
import { events, Q } from './context'

let time = 0

export const wallsTransform = mat4.create()
const rotation = quat.create()

Q.listen('state', events.FRAME, (s) => {
	time += s.device.tpf

	quat.fromEuler(
		rotation,
		Math.sin(0.0007 * time) * 1.1,
		time * 0.001,
		Math.sin(0.0008 * time) * 1.1,
	)

	mat4.fromRotationTranslationScaleOrigin(
		wallsTransform,
		rotation,
		[0, -8, 0],
		[0.8, 0.8, 0.8],
		[0, 60, 0],
	)
})
