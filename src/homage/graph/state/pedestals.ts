import { val, stream } from 'tvs-flow/lib/utils/entity-reference'
import { mat4 } from 'tvs-libs/lib/math/gl-matrix'
import * as vec from 'tvs-libs/lib/math/vectors'
import * as screens from './screens'
import { zip } from 'tvs-libs/lib/utils/sequence'


export const scale = val([1.65, 1, 1])


export const transforms = stream(
	[screens.rotations.HOT, screens.positions.HOT, scale.HOT],
	(rotations, positions, scale) =>

		zip(rotations, positions, (rot, pos) => {
			const p = vec.mul(pos, 1.045)
			p[1] -= 1.9

			const t = mat4.fromTranslation(mat4.create(), p)
			mat4.rotateY(t, t, rot)
			mat4.scale(t, t, scale)
			return t
		})
)
