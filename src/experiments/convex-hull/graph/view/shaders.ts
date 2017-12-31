import pvert from './shaders/point.vert'
import pfrag from './shaders/point.frag'
import sfrag from './shaders/side.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { ShadeData } from 'tvs-painter/dist/lib'


export const point = val({
  vert: pvert, frag: pfrag
} as ShadeData).reset()


export const sides = val(sfrag).reset()
