import { mat4, quat } from 'gl-matrix'
import { repeat } from 'shared-utils/scheduler'


let time = 0

repeat(tpf => time += tpf, 'updateTime')

export const wallsTransform = mat4.create()
const rotation = quat.create()

repeat(() => {
	quat.fromEuler(
		rotation,
		Math.sin(0.0007 * time) * 1.1,
		time * 0.001,
		Math.sin(0.0008 * time) * 1.1
	)
	mat4.fromRotationTranslationScaleOrigin(
		wallsTransform, rotation, [0, 0, 0], [1, 1, 1], [0, 100, 0]
	)
}, 'updateRotation')


export const floorTransform = mat4.create()

