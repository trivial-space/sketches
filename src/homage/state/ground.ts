import { mat4 } from 'gl-matrix'
import { addSystem, set } from 'shared-utils/painterState'
import * as geo from 'tvs-libs/dist/lib/math/geometry'
import { events, State } from '../context'


export class Ground {
	position = [0, -3.6, 0]
	normal = [0, 1, 0]
	scale = 1000
	transform = mat4.create()
	planeEquation!: number[]
	mirrorMatrix!: number[]
	groundMirrorView = mat4.create()

	constructor () {
		this.update()
	}

	update() {
		mat4.fromTranslation(this.transform, this.position)
		mat4.rotateX(this.transform, this.transform, Math.PI / 2)
		mat4.scale(this.transform, this.transform, [this.scale, this.scale, this.scale])

		this.planeEquation = geo.planeFromNormalAndCoplanarPoint(this.normal, this.position)
		this.mirrorMatrix = geo.mirrorMatrixFromPlane(this.planeEquation)
	}
}


addSystem<State>('groundState', (e, s) => {
	if (e === events.FRAME) {
		const v = s.viewPort
		const g = s.ground
		mat4.multiply(g.groundMirrorView, v.camera.viewMat, g.mirrorMatrix as any)
	}
})


set<State>('ground', new Ground(), {reset: {transform: true, mirrorMatrix: true}})
