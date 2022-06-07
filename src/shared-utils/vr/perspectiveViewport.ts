import {
	BaseState,
	PainterContext,
	baseEvents,
} from 'tvs-utils/dist/app/painterState'
import {
	PerspectiveCamera,
	WithInputNavigation,
	WithInputRotation,
} from './camera'

export interface PerspectiveViewportState extends BaseState {
	viewPort: ViewPort
}

export class ViewPort {
	moveSpeed = 2
	lookSpeed = 2
	camera = new (WithInputNavigation(WithInputRotation(PerspectiveCamera)))({
		fovy: Math.PI * 0.3,
		position: [0, 0, 5],
	})
}

interface InitOpts {
	moveSpeed?: number
	lookSpeed?: number
	fovy?: number
	position?: [number, number, number]
	rotationY?: number
	rotationX?: number
}

export function initPerspectiveViewport(
	ctx: PainterContext<PerspectiveViewportState>,
	{ lookSpeed, moveSpeed, position, rotationY, rotationX, fovy }: InitOpts = {},
) {
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

	ctx.set('viewPort', v, {
		reset: { moveSpeed: true, lookSpeed: true },
	})

	ctx.listen('viewPort', baseEvents.FRAME, ({ device: d, viewPort: v }) => {
		const tpf = d.tpf / 1000

		v.camera.updatePosFromInput(v.moveSpeed * tpf, d.keys, d.pointer)

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
	})

	ctx.listen('viewPort', baseEvents.RESIZE, ({ device: d, viewPort: v }) => {
		v.camera.aspect = d.canvas.width / d.canvas.height
		v.camera.needsUpdateProjection = true
	})
}
