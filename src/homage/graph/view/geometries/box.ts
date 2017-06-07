import {val, stream} from 'homage/flow'
import {convertStackGLGeometry} from 'tvs-renderer/lib/utils/stackgl/helpers'
import * as geo3dBox from 'geo-3d-box'

const makeBox = geo3dBox


export const id = val('box-geometry')

export const size = val([10, 14, 2])

export const segments = val([5, 7, 1])


export const geometry = stream(
  [size.HOT, segments.HOT],
  (size, segments) => convertStackGLGeometry(makeBox({ size, segments }))
)
