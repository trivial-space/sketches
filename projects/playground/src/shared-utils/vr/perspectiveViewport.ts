import { addSystem, set, BaseState, baseEvents } from '../painterState'
import {
	PerspectiveCamera,
	WithKeyNavigation,
	WithMouseRotation,
} from './camera'

export interface PerspectiveViewportState extends BaseState {
	viewPort: ViewPort
}

export class ViewPort {
	moveSpeed = 2
	lookSpeed = 5
	camera = new (WithKeyNavigation(WithMouseRotation(PerspectiveCamera)))({
		fovy: Math.PI * 0.3,
		position: [0, 0, 5],
	})
}

addSystem<PerspectiveViewportState>('viewPort', (e, s) => {
	const v = s.viewPort
	switch (e) {
		case baseEvents.FRAME:
			const d = s.device
			const tpf = d.tpf / 1000

			v.camera.updatePosFromInput(
				v.moveSpeed * tpf,
				s.device.keys,
				s.device.pointer,
			)

			const p = d.pointer
			const dragInfo = {
				dragging: p.dragging,
				drag: {
					x: (d.sizeMultiplier * p.drag.x) / d.canvas.width,
					y: (d.sizeMultiplier * p.drag.y) / d.canvas.height,
				},
			}
			v.camera.updateRotFromPointer(v.lookSpeed, dragInfo)
			v.camera.update()
			return

		case baseEvents.RESIZE:
			v.camera.aspect = s.device.canvas.width / s.device.canvas.height
			v.camera.needsUpdateProjection = true
	}
})

interface InitOpts {
	moveSpeed?: number
	lookSpeed?: number
	fovy?: number
	position?: [number, number, number]
	rotationY?: number
	rotationX?: number
}

export function initPerspectiveViewport({
	lookSpeed,
	moveSpeed,
	position,
	rotationY,
	rotationX,
	fovy,
}: InitOpts = {}) {
	const v = new ViewPort()
	if (lookSpeed) {
		v.lookSpeed = lookSpeed
	}
	if (moveSpeed) {
		v.moveSpeed = moveSpeed
	}
	if (fovy) {
		v.camera.fovy = fovy
		v.camera.needsUpdateProjection = true
	}
	if (position) {
		v.camera.position = position
		v.camera.needsUpdateView = true
	}
	if (rotationX) {
		v.camera.rotationX = rotationX
		v.camera.updateRotationX()
	}
	if (rotationY) {
		v.camera.rotationY = rotationY
		v.camera.updateRotationY()
	}
	set<PerspectiveViewportState>('viewPort', v, {
		reset: { moveSpeed: true, lookSpeed: true },
	})
}
