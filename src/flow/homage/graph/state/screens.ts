import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { mat4 } from 'gl-matrix'
import * as coords from 'tvs-libs/dist/lib/math/coords'
import * as videos from '../videos'
import { zip } from 'tvs-libs/dist/lib/utils/sequence'

export const radius = val(25)

export const height = val(2)

export const scale = val([1.6, 1, 1])

export const rotations = stream([videos.names.HOT], videos =>
	videos.map((_, i) => (Math.PI * 2 * i) / videos.length)
)

export const positions = stream(
	[radius.HOT, rotations.HOT, height.HOT],
	(radius, rotations, height) =>
		rotations.map(rot => {
			const phi = -rot - Math.PI / 2
			const [x, z] = coords.polarToCartesian2D([radius, phi])
			return [x, height, z]
		})
)

export const transforms = stream(
	[rotations.HOT, positions.HOT, scale.HOT],
	(rotations, positions, scale) =>
		zip(
			(rot, pos) => {
				const t = mat4.fromTranslation(mat4.create(), pos)
				mat4.rotateY(t, t, rot)
				mat4.scale(t, t, scale)
				return t
			},
			rotations,
			positions
		)
)
