import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import box from 'geo-3d-box'
import { convertStackGLGeometry } from 'tvs-renderer/dist/lib/utils/stackgl'


export const size = val([10, 10, 10])

export const segments = val([5, 5, 5])


export const geometry = stream(
  [size.HOT, segments.HOT],
  (size, segments) => convertStackGLGeometry(box({ size, segments }))
)
