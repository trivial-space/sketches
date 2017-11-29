import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import vert from './screen-vert.glsl'
import frag from './screen-frag.glsl'
import { ShadeData } from 'tvs-painter/dist/lib'


export const spec = val({
	vert, frag
} as ShadeData).reset()



