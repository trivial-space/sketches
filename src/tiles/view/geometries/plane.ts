import {val, stream, addToFlow} from '../../flow'
import {plane} from 'tvs-renderer/lib/utils/geometry/plane'
import * as init from '../../state/init'


export const id = val('plane-geometry')

export const segments = val(3)


export const geometry = stream(
  [init.tileSize.HOT, segments.HOT],
  (size, seg) => plane(size, size, seg, seg)
)


addToFlow({
  id,
  segments,
  geometry
}, 'view.geometries.plane')
