import { KeyCodes } from 'tvs-libs/dist/events/keyboard'
import { Buttons } from 'tvs-libs/dist/events/pointer'
import { PainterContext, baseEvents } from 'tvs-utils/dist/app/painterState'

interface CameraOptions {
	updateTransform(
		forward: number,
		left: number,
		up: number,
		rotationY: number,
		rotationX: number,
	): void
	updateScreen(width: number, height: number): void
	moveSpeed?: number
	lookSpeed?: number
}

let oldMouse = { x: 0, y: 0 }

export function initCamera(ctx: PainterContext, options: CameraOptions) {
	const {
		updateScreen,
		updateTransform,
		moveSpeed = 2,
		lookSpeed = 2,
	} = options

	ctx.listen('camera', baseEvents.FRAME, ({ device: d }) => {
		let up = 0
		let left = 0
		let forward = 0
		let rotY = 0
		let rotX = 0

		const moveDistance = (moveSpeed * d.tpf) / 1000

		const { keys, pointer } = d

		if (
			keys?.[KeyCodes.UP] ||
			keys?.[KeyCodes.W] ||
			(pointer?.holding && !pointer.pressed[Buttons.RIGHT])
		) {
			forward += moveDistance
		}
		if (
			keys?.[KeyCodes.DOWN] ||
			keys?.[KeyCodes.S] ||
			pointer?.pressed[Buttons.RIGHT]
		) {
			forward -= moveDistance
		}
		if (keys?.[KeyCodes.LEFT] || keys?.[KeyCodes.A]) {
			left += moveDistance
		}
		if (keys?.[KeyCodes.RIGHT] || keys?.[KeyCodes.D]) {
			left -= moveDistance
		}

		const m = {
			dragging: pointer.dragging,
			drag: {
				x: (d.sizeMultiplier * pointer.drag.x) / 1000,
				y: (d.sizeMultiplier * pointer.drag.y) / 1000,
			},
		}

		if (m.dragging) {
			const deltaX = oldMouse.x - m.drag.x
			const deltaY = oldMouse.y - m.drag.y
			oldMouse.x = m.drag.x
			oldMouse.y = m.drag.y
			deltaY && (rotX += deltaY * lookSpeed)
			deltaX && (rotY += deltaX * lookSpeed)
		} else {
			oldMouse.x && (oldMouse.x = 0)
			oldMouse.y && (oldMouse.y = 0)
		}

		if (left || forward || rotX || rotY) {
			updateTransform(forward, left, up, rotY, rotX)
		}
	})

	ctx.listen('camera', baseEvents.RESIZE, () => {
		updateScreen(ctx.gl.drawingBufferWidth, ctx.gl.drawingBufferHeight)
	})
}