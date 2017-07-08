import { val, asyncStream, EntityRef } from 'tvs-flow/lib/utils/entity-reference'
import * as flowCamera from 'tvs-libs/lib/vr/flow-camera'
import { canvasSize } from './painter'
import { Keys } from 'tvs-libs/lib/events/keyboard'
import { mat4, vec3 } from 'tvs-libs/lib/math/gl-matrix'
import { keys, tick, mouseDrag } from '../events'
import * as ground from '../state/ground'


export const {
	position, rotX, rotY, rotation, view
} = flowCamera.makeFirstPersonView()


export const {
	perspectiveSettings, perspective
} = flowCamera.makePerspective(canvasSize)


perspectiveSettings.updateVal(s => ({ ...s, fovy: Math.PI * 0.4 }))


export const moveSpeed = val(0.05)

export const lookSpeed = val(0.003)


export const moveForward: EntityRef<number> = asyncStream(
	[keys.COLD, moveSpeed.COLD, tick.HOT],
	(send, keys, speed, _) => {
		if (!keys) return
		if (keys[Keys.UP] || keys[Keys.W]) {
			send(speed)
		}
		if (keys[Keys.DOWN] || keys[Keys.S]) {
			send(-speed)
		}
	}
)


export const moveLeft: EntityRef<number> = asyncStream(
	[keys.COLD, moveSpeed.COLD, tick.HOT],
	(send, keys, speed) => {

		if (!keys) return
		if (keys[Keys.LEFT] || keys[Keys.A]) {
			send(speed)
		}
		if (keys[Keys.RIGHT] || keys[Keys.D]) {
			send(-speed)
		}
	}
)


rotX.react(
	[mouseDrag.HOT, lookSpeed.COLD],
	(rot, drag, speed) => rot + drag.y * speed
)


rotY.react(
	[mouseDrag.HOT, lookSpeed.COLD],
	(rot, drag, speed) => rot + drag.x * speed
)

position.react(
	[moveLeft.HOT, rotation.COLD],
	(pos, left, rotation) => {
		const v = [rotation.rotY[0], rotation.rotY[1], rotation.rotY[2]]
		return vec3.add(pos, pos, vec3.scale(v, v, -left)) as number[]
	}
)

position.react(
	[moveForward.HOT, rotation.COLD],
	(pos, forward, rotation) => {
		const v = [rotation.rotY[8], rotation.rotY[9], rotation.rotY[10]]
		return vec3.add(pos, pos, vec3.scale(v, v, -forward)) as number[]
	}
)


export const groundMirrorView = val(mat4.create())
.react(
	[view.HOT, ground.mirrorMatrix.HOT],
	mat4.multiply
)
