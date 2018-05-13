import vert from './glsl/base.vert'
import frag from './glsl/base.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { ShadeData } from 'tvs-painter/dist/lib'


export const base = val({
	vert, frag
} as ShadeData).reset()
