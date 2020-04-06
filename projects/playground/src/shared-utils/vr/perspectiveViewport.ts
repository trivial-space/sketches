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
	lookSpeed = 0.1
	camera = new (WithKeyNavigation(WithMouseRotation(PerspectiveCamera)))({
		fovy: Math.PI * 0.3,
		position: [0, 0, 5],
	})
}

addSystem<PerspectiveViewportState>('viewPort', (e, s) => {
	const v = s.viewPort
	switch (e) {
		case baseEvents.FRAME:
			const tpf = s.device.tpf / 1000
			v.camera.updatePosFromKeys(v.moveSpeed * tpf, s.device.keys)
			v.camera.updateRotFromMouse(v.lookSpeed * tpf, s.device.mouse)
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
		v.camera.needsUpdateView
	}
	if (rotationX) {
		v.camera.rotationX = rotationX
		v.camera.needsUpdateView
	}
	if (rotationY) {
		v.camera.rotationY = rotationY
		v.camera.needsUpdateView
	}
	set<PerspectiveViewportState>('viewPort', v, {
		reset: { moveSpeed: true, lookSpeed: true },
	})
}
