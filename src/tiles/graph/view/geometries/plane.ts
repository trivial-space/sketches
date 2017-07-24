import { plane } from 'tvs-renderer/dist/lib/utils/geometry/plane'
import * as init from '../../state/init'
import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'


export const segments = val(3)


export const geometry = stream(
  [init.tileSize.HOT, segments.HOT],
  (size, seg) => plane(size, size, seg, seg)
)
