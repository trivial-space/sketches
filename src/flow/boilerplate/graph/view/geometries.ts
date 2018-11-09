import { faceNormal, color, quad } from '../state/init'
import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { convertStackGLGeometry } from 'tvs-painter/dist/lib/utils/stackgl'
import { quadTriangles } from 'tvs-libs/dist/lib/geometry/quad'

export const plane = stream([quad.HOT, color.HOT, faceNormal.HOT], (q, c, n) =>
	convertStackGLGeometry({
		position: q,
		color: q.map(() => c),
		normal: q.map(() => n),
		cells: quadTriangles
	})
)
