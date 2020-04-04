import { mat4, vec3 } from 'gl-matrix'
import { set } from '../../shared-utils/painterState'
import * as coords from 'tvs-libs/dist/math/coords'
import { mul } from 'tvs-libs/dist/math/vectors'
import { flatten, zip } from 'tvs-libs/dist/utils/sequence'
import { State } from '../context'
import { planeSize } from '../geometries'
import * as videos from './videos'

export class Screens {
	radius = 25
	height = 2
	scale = [1.6, 1, 1]
	rotations = videos.names.map(
		(_, i) => (Math.PI * 2 * i) / videos.names.length,
	)
	positions!: vec3[]
	screenTransforms!: mat4[]
	pedestalTransforms!: mat4[]
	lights!: number[]
	lightSize!: [number, number]

	constructor() {
		this.update()
	}

	update() {
		this.positions = this.rotations.map(rot => {
			const phi = -rot - Math.PI / 2
			const [x, z] = coords.polarToCartesian2D([this.radius, phi])
			return [x, this.height, z]
		})

		this.screenTransforms = zip(
			(rot, pos) => {
				const t = mat4.fromTranslation(mat4.create(), pos)
				mat4.rotateY(t, t, rot)
				mat4.scale(t, t, this.scale as vec3)
				return t
			},
			this.rotations,
			this.positions,
		)

		this.pedestalTransforms = zip(
			(rot, pos) => {
				const p = mul(1.045, pos) as vec3
				p[1] -= 2

				const t = mat4.fromTranslation(mat4.create(), p)
				mat4.rotateY(t, t, rot)
				mat4.scale(t, t, this.scale.map(v => v * 1.03) as vec3)
				return t
			},
			this.rotations,
			this.positions,
		)

		this.lights = flatten(
			zip((p, r) => [...p, r], this.positions, this.rotations),
		)

		this.lightSize = [
			planeSize.width * this.scale[0],
			planeSize.height * this.scale[1],
		]
	}
}

set<State>('screens', new Screens())