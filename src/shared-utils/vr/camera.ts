import { mat4, vec3 } from 'gl-matrix'
import { Constructor } from 'tvs-libs/dist/oop/mixins'
import { KeyState, KeyboardCode } from '../events/keyboard'
import { PointerState, Buttons } from '../events/pointer'

export class Camera {
	position: vec3 = [0, 0, 0]
	rotationX = 0
	rotationY = 0
	rotationXMat = mat4.create()
	rotationYMat = mat4.create()
	projectionMat = mat4.create()
	viewMat = mat4.create()
	needsUpdateView = true

	constructor(props?: Partial<Camera>) {
		Object.assign(this, props)
		this.updateRotationX()
		this.updateRotationY()
	}

	updateRotationX(amount: number = 0) {
		this.rotationX += amount
		mat4.fromXRotation(this.rotationXMat, this.rotationX)
		this.needsUpdateView = true
	}

	updateRotationY(amount: number = 0) {
		this.rotationY += amount
		mat4.fromYRotation(this.rotationYMat, this.rotationY)
		this.needsUpdateView = true
	}

	moveForward(dist: number) {
		const v = vec3.fromValues(
			this.rotationYMat[8],
			this.rotationYMat[9],
			this.rotationYMat[10],
		)
		vec3.add(this.position as any, this.position, vec3.scale(v, v, -dist))
		this.needsUpdateView = true
	}

	moveLeft(dist: number) {
		const v = vec3.fromValues(
			this.rotationYMat[0],
			this.rotationYMat[1],
			this.rotationYMat[2],
		)
		vec3.add(this.position as any, this.position, vec3.scale(v, v, -dist))
		this.needsUpdateView = true
	}

	moveUp(dist: number) {
		const v = vec3.fromValues(
			this.rotationYMat[4],
			this.rotationYMat[5],
			this.rotationYMat[6],
		)
		vec3.add(this.position as any, this.position, vec3.scale(v, v, dist))
		this.needsUpdateView = true
	}

	update() {
		if (this.needsUpdateView) {
			mat4.fromTranslation(this.viewMat, this.position)
			mat4.multiply(this.viewMat, this.viewMat, this.rotationYMat)
			mat4.multiply(this.viewMat, this.viewMat, this.rotationXMat)
			mat4.invert(this.viewMat, this.viewMat)
			this.needsUpdateView = false
		}
	}
}

export class PerspectiveCamera extends Camera {
	fovy = Math.PI * 0.6
	aspect = 1
	near = 0.1
	far = 1000
	needsUpdateProjection = true

	constructor(props?: Partial<PerspectiveCamera>) {
		super(props)
		Object.assign(this, props)
		this.update()
	}

	update() {
		super.update()

		if (this.needsUpdateProjection) {
			mat4.perspective(
				this.projectionMat,
				this.fovy,
				this.aspect,
				this.near,
				this.far,
			)
			this.needsUpdateProjection = false
		}
	}
}

export function WithInputNavigation<T extends Constructor<Camera>>(Cam: T) {
	return class extends Cam {
		updatePosFromInput(speed: number, keys?: KeyState, pointer?: PointerState) {
			if (!(keys || pointer)) return
			if (
				keys?.codes[KeyboardCode.ArrowUp] ||
				keys?.codes[KeyboardCode.KeyW] ||
				(pointer?.holding && !pointer.pressed[Buttons.RIGHT])
			) {
				this.moveForward(speed)
			}
			if (
				keys?.codes[KeyboardCode.ArrowDown] ||
				keys?.codes[KeyboardCode.KeyS] ||
				pointer?.pressed[Buttons.RIGHT]
			) {
				this.moveForward(-speed)
			}
			if (
				keys?.codes[KeyboardCode.ArrowLeft] ||
				keys?.codes[KeyboardCode.KeyA]
			) {
				this.moveLeft(speed)
			}
			if (
				keys?.codes[KeyboardCode.ArrowRight] ||
				keys?.codes[KeyboardCode.KeyD]
			) {
				this.moveLeft(-speed)
			}
		}
	}
}

export function WithInputRotation<T extends Constructor<Camera>>(Cam: T) {
	return class extends Cam {
		_oldMouse = { x: 0, y: 0 }

		updateRotFromPointer(
			speed: number,
			m: { dragging: boolean; drag: { x: number; y: number } },
		) {
			const old = this._oldMouse
			if (m.dragging) {
				const deltaX = old.x - m.drag.x
				const deltaY = old.y - m.drag.y
				old.x = m.drag.x
				old.y = m.drag.y
				deltaY && this.updateRotationX(deltaY * speed)
				deltaX && this.updateRotationY(deltaX * speed)
			} else {
				old.x && (old.x = 0)
				old.y && (old.y = 0)
			}
		}
	}
}
