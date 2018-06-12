import { faceNormal, colors, box, boxSliceCount } from '../state/init'
import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { convertStackGLGeometry } from 'tvs-painter/dist/lib/utils/stackgl'
import { triangulate } from 'tvs-libs/dist/lib/geometry/quad'
import { flatten } from 'tvs-libs/dist/lib/utils/sequence'


export const plane = stream(
	[box.HOT, colors.HOT, faceNormal.HOT, boxSliceCount.HOT],
	(b, c, n, sliceCount) => convertStackGLGeometry({
		position: flatten(flatten(b)),
		color: flatten(b.map((side, i) => flatten(side.map((slice, j) => slice.map(() => c[i * sliceCount + j]))))),
		normal: flatten(b.map((side, i) => flatten(side).map(() => n[i]))),
		cells: triangulate(4 * sliceCount * 4)
	})
)
