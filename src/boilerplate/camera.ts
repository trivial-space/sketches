import { state } from './context'
import { WithKeyNavigation, PerspectiveCamera, WithMouseRotation } from 'shared-utils/vr/camera'


export class ViewPort {
	moveSpeed = 0.02
	lookSpeed = 0.002
	camera = new (WithKeyNavigation(WithMouseRotation(PerspectiveCamera)))({
		fovy: Math.PI * 0.4,
		position: [0, 0, 5]
	})

	updateSize(canvas: HTMLCanvasElement) {
		this.camera.aspect = canvas.width / canvas.height
		this.camera.needsUpdateProjection = true
	}

	update(tpf: number) {
		this.camera.updatePosFromKeys(this.moveSpeed * tpf * 0.06, state.input.keys)
		this.camera.updateRotFromMouse(this.lookSpeed * tpf * 0.06, state.input.mouse)
		this.camera.update()
	}
}


state.viewPort = new ViewPort()
