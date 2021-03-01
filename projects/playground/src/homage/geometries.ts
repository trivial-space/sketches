import box from 'geo-3d-box'
import { plane } from 'tvs-painter/dist/utils/geometry/plane'
import { convertStackGLGeometry } from 'tvs-painter/dist/utils/stackgl'
import { Q } from './context'

export const planeSize = {
	width: 10,
	height: 10,
}

export const planeForm = Q.getForm('plane').update(
	plane(planeSize.width, planeSize.height, 5, 5),
)

const size = [10, 14, 2]
const segments = [5, 7, 1]

export const boxForm = Q.getForm('box').update(
	convertStackGLGeometry(box({ size, segments })),
)
