import { mat4 } from 'gl-matrix'
import { mul } from 'tvs-libs/dist/lib/math/vectors'
import * as screens from './screens'
import { zip } from 'tvs-libs/dist/lib/utils/sequence'


const scale = [1.65, 1, 1]


export const transforms = zip((rot, pos) => {
	const p = mul(1.045, pos)
	p[1] -= 1.9

	const t = mat4.fromTranslation(mat4.create(), p)
	mat4.rotateY(t, t, rot)
	mat4.scale(t, t, scale)
	return t
}, screens.rotations, screens.positions)
