import { mat4, vec3 } from 'gl-matrix'
import * as coords from 'tvs-libs/dist/math/coords'
import { mul } from 'tvs-libs/dist/math/vectors'
import { flatten, zip } from 'tvs-libs/dist/utils/sequence'
import { planeSize } from '../geometries'
import * as videos from './videos'

const radius = 25
const height = 2
const scale = [1.6, 1, 1]
const rotations = videos.names.map(
	(_, i) => (Math.PI * 2 * i) / videos.names.length,
)

const positions = rotations.map((rot) => {
	const phi = -rot - Math.PI / 2
	const [x, z] = coords.polarToCartesian2D([radius, phi])
	return [x, height, z]
})

export const screenTransforms = zip(
	(rot, pos) => {
		const t = mat4.fromTranslation(mat4.create(), pos as vec3)
		mat4.rotateY(t, t, rot)
		mat4.scale(t, t, scale as vec3)
		return t
	},
	rotations,
	positions,
)

export const pedestalTransforms = zip(
	(rot, pos) => {
		const p = mul(1.045, pos) as vec3
		p[1] -= 2

		const t = mat4.fromTranslation(mat4.create(), p)
		mat4.rotateY(t, t, rot)
		mat4.scale(t, t, scale.map((v) => v * 1.03) as vec3)
		return t
	},
	rotations,
	positions,
)

export const lights = flatten(zip((p, r) => [...p, r], positions, rotations))

export const lightSize = [
	planeSize.width * scale[0],
	planeSize.height * scale[1],
]
