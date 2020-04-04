import { mat4, vec3 } from 'gl-matrix'
import * as geo from 'tvs-libs/dist/math/geometry'
import { State } from '../context'
import { set } from '../../shared-utils/painterState'

export class Ground {
	position: vec3 = [0, -3.6, 0]
	normal = [0, 1, 0]
	scale = 1000
	transform = mat4.create()
	planeEquation!: number[]
	mirrorMatrix!: number[]
	groundMirrorView = mat4.create()

	constructor() {
		this.update()
	}

	update() {
		mat4.fromTranslation(this.transform, this.position)
		mat4.rotateX(this.transform, this.transform, Math.PI / 2)
		mat4.scale(this.transform, this.transform, [
			this.scale,
			this.scale,
			this.scale,
		])

		this.planeEquation = geo.planeFromNormalAndCoplanarPoint(
			this.normal,
			this.position,
		)
		this.mirrorMatrix = geo.mirrorMatrixFromPlane(this.planeEquation)
	}
}

set<State>('ground', new Ground(), {
	reset: { transform: true, mirrorMatrix: true },
})