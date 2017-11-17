import vert from './point.vert'
import frag from './point.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'


export const spec = val({
  vert, frag
}).reset()
