import { convertStackGLGeometry } from 'tvs-painter/dist/lib/utils/stackgl'
import { extrudeBottom, quadTriangles } from 'tvs-libs/dist/lib/geometry/quad'
import { normal } from 'tvs-libs/dist/lib/geometry/primitives'
import { getForm } from 'shared-utils/painterState'
import { painter, state } from './context'



const quad = extrudeBottom([0, -2, 0], [[-1, 1, 0], [1, 1, 0]])


export const planeForm = getForm(painter, 'plane')
.update(
	convertStackGLGeometry({
		position: quad,
		color: quad.map(() => state.entities.quad.color),
		normal: quad.map(() => normal(quad)),
		cells: quadTriangles
	})
)


if (module.hot) {
	module.hot.accept()
}