import { mat4, vec3 } from 'gl-matrix'
import { Keys, KeyState } from 'tvs-libs/dist/lib/events/keyboard'
import { MouseState } from 'tvs-libs/dist/lib/events/mouse'
import { Constructor } from 'tvs-libs/lib/oop/mixins'


export class Camera {
	position = [0, 0, 0]
	rotationX = 0
	rotationY = 0
	rotationXMat = mat4.create()
	rotationYMat = mat4.create()
	projectionMat = mat4.create()
	viewMat = mat4.create()
	needsUpdateView = true

	constructor(props?: Partial<Camera>) {
		Object.assign(this, props)
	}

	updateRotationX (amount: number = 0) {
		this.rotationX += amount
		mat4.fromXRotation(this.rotationXMat, this.rotationX)
		this.needsUpdateView = true
	}

	updateRotationY (amount: number = 0) {
		this.rotationY += amount
		mat4.fromYRotation(this.rotationYMat, this.rotationY)
		this.needsUpdateView = true
	}

	moveForward (dist: number) {
		const v = vec3.fromValues(this.rotationYMat[8], this.rotationYMat[9], this.rotationYMat[10])
		vec3.add(this.position as any, this.position, vec3.scale(v, v, -dist))
		this.needsUpdateView = true
	}

	moveLeft (dist: number) {
		const v = vec3.fromValues(this.rotationYMat[0], this.rotationYMat[1], this.rotationYMat[2])
		vec3.add(this.position as any, this.position, vec3.scale(v, v, -dist))
		this.needsUpdateView = true
	}

	moveUp (dist: number) {
		const v = vec3.fromValues(this.rotationYMat[4], this.rotationYMat[5], this.rotationYMat[6])
		vec3.add(this.position as any, this.position, vec3.scale(v, v, dist))
		this.needsUpdateView = true
	}

	update () {
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
	}

	update () {
		super.update()

		if (this.needsUpdateProjection) {
			mat4.perspective(
				this.projectionMat,
				this.fovy,
				this.aspect,
				this.near,
				this.far
			)
			this.needsUpdateProjection = false
		}
	}
}


export function WithKeyNavigation<T extends Constructor<Camera>> (Cam: T) {
	return class extends Cam {
		updatePosFromKeys (speed: number, keys: KeyState) {
			if (!keys) return
			if (keys[Keys.UP] || keys[Keys.W]) {
				this.moveForward(speed)
			}
			if (keys[Keys.DOWN] || keys[Keys.S]) {
				this.moveForward(-speed)
			}
			if (keys[Keys.LEFT] || keys[Keys.A]) {
				this.moveLeft(speed)
			}
			if (keys[Keys.RIGHT] || keys[Keys.D]) {
				this.moveLeft(-speed)
			}
		}
	}
}


export function WithMouseRotation<T extends Constructor<Camera>> (Cam: T) {
	return class extends Cam {
		_oldMouse = { x: 0, y: 0 }

		updateRotFromMouse (speed: number, m: MouseState) {
			if (m.dragging) {
				const deltaX = this._oldMouse.x - m.drag.x
				const deltaY = this._oldMouse.y - m.drag.y
				this._oldMouse.x = m.drag.x
				this._oldMouse.y = m.drag.y
				deltaY && this.updateRotationX(deltaY * speed)
				deltaX && this.updateRotationY(deltaX * speed)
			} else {
				this._oldMouse.x && (this._oldMouse.x = 0)
				this._oldMouse.y && (this._oldMouse.y = 0)
			}
		}
	}
}
