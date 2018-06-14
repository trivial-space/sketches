import vert from './base-vert.glsl'
import frag from './base-frag.glsl'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { ShadeData } from 'tvs-painter/dist/lib'


export const spec = val({
  vert, frag
} as ShadeData).reset()
