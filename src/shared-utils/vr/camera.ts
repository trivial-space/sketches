import { mat4, vec3 } from 'gl-matrix'
import { Keys, KeyState } from 'tvs-libs/dist/lib/events/keyboard'
import { MouseState } from 'tvs-libs/dist/lib/events/mouse'


export class Camera {
	fovy = Math.PI * 0.6
	aspect = 1
	near = 0.1
	far = 1000
	position = [0, 0, 0]
	rotationX = mat4.create()
	rotationY = mat4.create()
	perspective = mat4.create()
	view = mat4.create()
	needsUpdatePerspective = true
	needsUpdateView = false

	constructor(props: Partial<Camera>) {
		Object.assign(this, props)
	}
}


export function rotateX (cam: Camera, rot: number) {
	mat4.rotateX(cam.rotationX, cam.rotationX, rot)
	cam.needsUpdateView = true
}

export function rotateY (cam: Camera, rot: number) {
	mat4.rotateX(cam.rotationY, cam.rotationY, rot)
	cam.needsUpdateView = true
}

export function moveForward (cam: Camera, dist: number) {
	const v = vec3.fromValues(cam.rotationY[8], cam.rotationY[9], cam.rotationY[10])
	vec3.add(cam.position as any, cam.position, vec3.scale(v, v, -dist))
	cam.needsUpdateView = true
}

export function moveLeft (cam: Camera, dist: number) {
	const v = vec3.fromValues(cam.rotationY[0], cam.rotationY[1], cam.rotationY[2])
	vec3.add(cam.position as any, cam.position, vec3.scale(v, v, -dist))
	cam.needsUpdateView = true
}

export function moveUp (cam: Camera, dist: number) {
	const v = vec3.fromValues(cam.rotationY[4], cam.rotationY[5], cam.rotationY[6])
	vec3.add(cam.position as any, cam.position, vec3.scale(v, v, dist))
	cam.needsUpdateView = true
}


export function update (cam: Camera) {

	if (cam.needsUpdatePerspective) {
		mat4.perspective(
			cam.perspective,
			cam.fovy,
			cam.aspect,
			cam.near,
			cam.far
		)
		cam.needsUpdatePerspective = false
	}

	if (cam.needsUpdateView) {
		mat4.fromTranslation(cam.view, cam.position)
		mat4.multiply(cam.view, cam.view, cam.rotationY)
		mat4.multiply(cam.view, cam.view, cam.rotationX)
		mat4.invert(cam.view, cam.view)
		cam.needsUpdateView = false
	}
}


export function updatePosFromKeys (cam: Camera, speed: number, keys: KeyState) {
	if (!keys) return
	if (keys[Keys.UP] || keys[Keys.W]) {
		moveForward(cam, speed)
	}
	if (keys[Keys.DOWN] || keys[Keys.S]) {
		moveForward(cam, -speed)
	}
	if (keys[Keys.LEFT] || keys[Keys.A]) {
		moveLeft(cam, speed)
	}
	if (keys[Keys.RIGHT] || keys[Keys.D]) {
		moveLeft(cam, -speed)
	}
}


export function updateRotFromMouse (cam: Camera, speed: number, m: MouseState) {
	m.drag.dY && rotateX(cam, m.drag.dY * speed)
	m.drag.dX && rotateY(cam, m.drag.dX * speed)
}
