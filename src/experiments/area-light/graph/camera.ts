import { val, asyncStream, EntityRef, delta, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import * as flowCamera from 'tvs-libs/dist/lib/vr/flow-camera'
import { canvasSize } from './painter'
import { Keys } from 'tvs-libs/dist/lib/events/keyboard'
import { vec3 } from 'gl-matrix'
import { keys, tick, mouse } from './events'


export const {
	position, rotX, rotY, rotation, view
} = flowCamera.makeFirstPersonView()


position.val(vec3.fromValues(11, 2, -9))
rotX.val(0)
rotY.val(2)


export const {
	perspectiveSettings, perspective
} = flowCamera.makePerspective(canvasSize)


perspectiveSettings.updateVal(s => ({ ...s, fovy: Math.PI * 0.4 }))


export const moveSpeed = val(0.15)

export const lookSpeed = val(0.002)


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


export const mouseDrag = stream(
	[mouse.HOT], m => ({
		x: m.drag.x,
		y: m.drag.y
	})
)


export const dragDeltas = delta(mouseDrag, (n, o) => ({
	x: n.x === 0 ? n.x : o.x - n.x,
	y: n.y === 0 ? n.y : o.y - n.y
}))
.accept(drag => !!(drag && (drag.x || drag.y)))


rotX.react(
	[dragDeltas.HOT, lookSpeed.COLD],
	(rot, drag, speed) => rot + drag.y * speed
)


rotY.react(
	[dragDeltas.HOT, lookSpeed.COLD],
	(rot, drag, speed) => rot + drag.x * speed
)

position.react(
	[moveLeft.HOT, rotation.COLD],
	(pos, left, rotation) => {
		const v = vec3.fromValues(rotation.rotY[0], rotation.rotY[1], rotation.rotY[2])
		return vec3.add(pos, pos, vec3.scale(v, v, -left))
	}
)

position.react(
	[moveForward.HOT, rotation.COLD],
	(pos, forward, rotation) => {
		const v = vec3.fromValues(rotation.rotY[8], rotation.rotY[9], rotation.rotY[10])
		return vec3.add(pos, pos, vec3.scale(v, v, -forward))
	}
)
