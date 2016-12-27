import {entity, addToFlow} from '../../flow'
import {plane} from 'tvs-renderer/lib/utils/geometry/plane'
import * as init from '../../state/init'


export const id = entity('plane-geometry')

export const segments = entity(3)


export const geometry = entity()
  .stream({
    with: {
      seg: segments.HOT,
      size: init.tileSize.HOT
    },
    do: ({seg, size}) => plane( size, size, seg, seg )
  })


addToFlow({
  id,
  segments,
  geometry
}, 'view.geometries.plane')
