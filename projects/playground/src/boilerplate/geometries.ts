import { getForm } from '../shared-utils/painterState'
import { normal } from 'tvs-libs/dist/geometry/primitives'
import { extrudeBottom, quadTriangles } from 'tvs-libs/dist/geometry/quad'
import { convertStackGLGeometry } from 'tvs-painter/dist/utils/stackgl'
import { painter, state } from './context'

const quad = extrudeBottom(
	[0, -2, 0],
	[
		[-1, 1, 0],
		[1, 1, 0],
	],
)

export const planeForm = getForm(painter, 'plane').update(
	convertStackGLGeometry({
		position: quad,
		color: quad.map(() => state.entities.quad.color),
		normal: quad.map(() => normal(quad)),
		cells: quadTriangles,
	}),
)
