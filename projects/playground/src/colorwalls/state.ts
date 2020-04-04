import { mat4, quat } from 'gl-matrix'
import { addSystem } from 'shared-utils/painterState'
import * as geo from 'tvs-libs/dist/math/geometry'
import { events } from './context'
import { groundHeight } from './geometries'

let time = 0

export const wallsTransform = mat4.create()
const rotation = quat.create()

export const floorTransform = mat4.create()

export const floorMirrorView = mat4.create()

const planeEquation = geo.planeFromNormalAndCoplanarPoint(
	[0, 1, 0],
	[0, groundHeight, 0]
)
export const floorMirrorMatrix = geo.mirrorMatrixFromPlane(planeEquation)

addSystem('state', (e, s) => {
	if (e === events.FRAME) {
		time += s.device.tpf

		quat.fromEuler(
			rotation,
			Math.sin(0.0007 * time) * 1.1,
			time * 0.001,
			Math.sin(0.0008 * time) * 1.1
		)

		mat4.fromRotationTranslationScaleOrigin(
			wallsTransform,
			rotation,
			[0, 0, 0],
			[1, 1, 1],
			[0, 100, 0]
		)
	}
})
