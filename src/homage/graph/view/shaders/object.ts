import { val } from 'tvs-flow/lib/utils/entity-reference'
import vert from './object-vert.glsl'
import frag from './object-frag.glsl'


export const spec = val({
	vert, frag
}).reset()

