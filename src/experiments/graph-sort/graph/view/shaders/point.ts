import vert from './point.vert'
import frag from './point.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { ShadeData } from 'tvs-painter/dist/lib'


export const spec = val({
  vert, frag
} as ShadeData).reset()
