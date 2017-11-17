import vert from './line.vert'
import frag from './line.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'


export const spec = val({
  vert, frag
}).reset()
