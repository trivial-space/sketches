import { val, stream } from 'tvs-flow/lib/utils/entity-reference'
import box from 'geo-3d-box'
import { convertStackGLGeometry } from 'tvs-renderer/lib/utils/stackgl'


export const size = val([10, 14, 2])

export const segments = val([5, 7, 1])


export const geometry = stream(
  [size.HOT, segments.HOT],
  (size, segments) => convertStackGLGeometry(box({ size, segments }))
)
