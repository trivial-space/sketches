import { normal } from 'tvs-libs/dist/geometry/primitives'
import { extrudeBottom, quadTriangles } from 'tvs-libs/dist/geometry/quad'
import { convertStackGLGeometry } from 'tvs-painter/dist/utils/stackgl'
import { Q } from './context'

const quad = extrudeBottom(
	[0, -2, 0],
	[
		[-1, 1, 0],
		[1, 1, 0],
	],
)

export const planeForm = Q.getForm('plane').update(
	convertStackGLGeometry({
		position: quad,
		color: quad.map(() => Q.state.entities.quad.color),
		normal: quad.map(() => normal(quad)),
		cells: quadTriangles,
	}),
)
