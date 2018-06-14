import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import {  } from 'tvs-libs/dist/lib/geometry/quad'
import { tick } from '../events'
import { mat4, quat } from 'gl-matrix'
import {  } from 'tvs-libs/dist/lib/utils/sequence'


export const time = val(0)
.react(
	[tick.HOT],
	(self, tpf) => self + tpf
)

export const rotation = val(quat.create())
.react(
	[time.HOT],
	(self, time) => quat.fromEuler(
		self,
		Math.sin(0.0007 * time) * 1.1,
		time * 0.001,
		Math.sin(0.0008 * time) * 1.1
	)
)

export const transform = val(mat4.create())
.react(
	[rotation.HOT],
	(self, rotation) => mat4.fromRotationTranslationScaleOrigin(self, rotation, [0, 0, 0], [1, 1, 1], [0, 100, 0])
)


export const transformFloor = val(mat4.create())

