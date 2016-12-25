import {entity, addToFlow} from '../../flow'
import {renderUtils} from 'tvs-renderer'
import * as geo3dBox from 'geo-3d-box'

const makeBox = geo3dBox as any


export const id = entity('box-geometry')

export const size = entity([10, 14, 2])

export const segments = entity([5, 7, 1])


export const geometry = entity()
  .stream({
    with: {
      size: size.HOT,
      segments: segments.HOT
    },
    do: ({size, segments}) =>
      renderUtils.stackgl.convertStackGLGeometry(makeBox({ size, segments }))
  })


addToFlow({
  id,
  geometry,
  size,
  segments
}, 'geometries.box')
