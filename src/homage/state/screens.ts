import { mat4 } from 'gl-matrix'
import * as coords from 'tvs-libs/dist/lib/math/coords'
import * as videos from './videos'
import { zip, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { mul } from 'tvs-libs/dist/lib/math/vectors'
import { set } from 'shared-utils/painterState'
import { State } from '../context'
import { planeSize } from '../geometries'


export class Screens {
	radius = 25
	height = 2
	scale = [1.6, 1, 1]
	rotations = videos.names.map((_, i) => Math.PI * 2 * i / videos.names.length)
	positions!: number[][]
	screenTransforms!: mat4[]
	pedestalTransforms!: mat4[]
	lights!: number[]
	lightSize!: [number, number]

	constructor () {
		this.update()
	}

	update() {
		this.positions = this.rotations.map(rot => {
			const phi = -rot - Math.PI / 2
			const [x, z] = coords.polarToCartesian2D([this.radius, phi])
			return [x, this.height, z]
		})

		this.screenTransforms = zip((rot, pos) => {
			const t = mat4.fromTranslation(mat4.create(), pos)
			mat4.rotateY(t, t, rot)
			mat4.scale(t, t, this.scale)
			return t
		}, this.rotations, this.positions)

		this.pedestalTransforms = zip((rot, pos) => {
			const p = mul(1.045, pos)
			p[1] -= 2

			const t = mat4.fromTranslation(mat4.create(), p)
			mat4.rotateY(t, t, rot)
			mat4.scale(t, t, this.scale.map(v => v * 1.03))
			return t
		}, this.rotations, this.positions)

		this.lights = flatten(zip((p, r) => [...p, r], this.positions, this.rotations))

		this.lightSize = [planeSize.width * this.scale[0], planeSize.height * this.scale[1]]
	}
}


set<State>('screens', new Screens())
