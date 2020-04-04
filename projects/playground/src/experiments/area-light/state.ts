import { mat4 } from 'gl-matrix'
import { addSystem, set } from 'shared-utils/painterState'
import { events, State } from './context'

export class SceneState {
	time = 0

	groundColor = [0.7, 0.6, 0.9, 1]
	groundTransform = mat4.create()

	rotationSpeed = 0.0002
	lightRotation = -Math.PI * 0.8
	lightPosition = [0, 3.5, 0]
	lightColor = [1.0, 1.0, 1.0, 0.0]
	lightBackColor = [0.0, 0.0, 0.2, 0.0]
	lightTransforms = [mat4.create(), mat4.create()]

	constructor() {
		mat4.rotateX(this.groundTransform, this.groundTransform, Math.PI / 2)
		mat4.scale(this.groundTransform, this.groundTransform, [10, 10, 10])
		this.update(0)
	}

	update(tpf: number) {
		this.time += tpf
		this.lightRotation += this.rotationSpeed * tpf

		this.lightPosition[1] += Math.sin(this.time / 2000) * 0.05

		mat4.fromTranslation(this.lightTransforms[0], this.lightPosition)
		mat4.rotateX(
			this.lightTransforms[0],
			this.lightTransforms[0],
			this.lightRotation,
		)
		mat4.rotateX(this.lightTransforms[1], this.lightTransforms[0], Math.PI)
	}
}

addSystem<State>('entities', (e, s) => {
	switch (e) {
		case events.FRAME:
			s.scene.update(s.device.tpf)
			return
	}
})

set<State>('scene', new SceneState())
