import { PainterContext, baseEvents } from '../app/painterState'
import { KeyboardCode } from '../events/keyboard'
import { Buttons } from '../events/pointer'

interface CameraTransform {
	pos: [number, number, number]
	rot_horizontal: number
	rot_vertical: number
}

interface CameraOptions {
	updateTransform(
		forward: number,
		left: number,
		up: number,
		rotationY: number,
		rotationX: number,
	): CameraTransform
	updateScreen(width: number, height: number): void
	resetCamera(
		x: number,
		y: number,
		z: number,
		rotHorizontal: number,
		rotVertical: number,
	): void
	moveSpeed?: number
	lookSpeed?: number
}

let oldMouse = { x: 0, y: 0 }
let oldCamera: CameraTransform | null = null

export function initCamera(ctx: PainterContext, options: CameraOptions) {
	const {
		updateScreen,
		updateTransform,
		resetCamera,
		moveSpeed = 1,
		lookSpeed = 1,
	} = options

	if (oldCamera) {
		resetCamera(
			oldCamera.pos[0],
			oldCamera.pos[1],
			oldCamera.pos[2],
			oldCamera.rot_horizontal,
			oldCamera.rot_vertical,
		)
	}

	ctx.listen('camera', baseEvents.FRAME, ({ device: d }) => {
		let up = 0
		let left = 0
		let forward = 0
		let rotY = 0
		let rotX = 0

		const moveDistance = (moveSpeed * d.tpf) / 1000

		const { keys, pointer } = d

		if (
			keys.codes[KeyboardCode.ArrowUp] ||
			keys.codes[KeyboardCode.KeyW] ||
			(pointer?.holding && !pointer.pressed[Buttons.RIGHT])
		) {
			forward += moveDistance
		}
		if (
			keys.codes[KeyboardCode.ArrowDown] ||
			keys.codes[KeyboardCode.KeyS] ||
			pointer?.pressed[Buttons.RIGHT]
		) {
			forward -= moveDistance
		}
		if (keys.codes[KeyboardCode.ArrowLeft] || keys.codes[KeyboardCode.KeyA]) {
			left += moveDistance
		}
		if (keys.codes[KeyboardCode.ArrowRight] || keys.codes[KeyboardCode.KeyD]) {
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
			oldCamera = updateTransform(forward, left, up, rotY, rotX)
		}
	})

	ctx.listen('camera', baseEvents.RESIZE, () => {
		updateScreen(ctx.gl.drawingBufferWidth, ctx.gl.drawingBufferHeight)
	})
}
