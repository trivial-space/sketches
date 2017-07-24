import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import vert from './object-vert.glsl'
import frag from './object-frag.glsl'


export const spec = val({
	vert, frag
}).reset()

