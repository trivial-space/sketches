import { convertStackGLGeometry } from 'tvs-painter/dist/lib/utils/stackgl'
import { extrudeBottom, quadTriangles } from 'tvs-libs/dist/lib/geometry/quad'
import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { normal } from 'tvs-libs/dist/lib/geometry/primitives'
import { getForm } from 'shared-utils/painterState'
import { painter } from './context'


const color = [normalRand(), normalRand(), normalRand()]

const quad = extrudeBottom([0, -2, 0], [[-1, 1, 0], [1, 1, 0]])


export const planeForm = getForm(painter, 'plane')
.update(
	convertStackGLGeometry({
		position: quad,
		color: quad.map(() => color),
		normal: quad.map(() => normal(quad)),
		cells: quadTriangles
	})
)


if (module.hot) {
	module.hot.accept()
}
