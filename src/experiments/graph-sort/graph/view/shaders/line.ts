import vert from './line.vert'
import frag from './line.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { ShadeData } from 'tvs-painter/dist/lib'


export const spec = val({
  vert, frag
} as ShadeData).reset()
