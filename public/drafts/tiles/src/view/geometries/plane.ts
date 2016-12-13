import {entity, addToFlow} from '../../flow'
import {renderUtils} from 'tvs-renderer'
import * as init from '../../state/init'


export const id = entity('plane-geometry')

export const segments = entity(3)


export const geometry = entity()
  .stream({
    with: {
      seg: segments.HOT,
      size: init.tileSize.HOT
    },
    do: ({seg, size}) => renderUtils.geometry.plane( size, size, seg, seg )
  })


addToFlow({
  id,
  segments,
  geometry
}, 'view.geometries.plane')
