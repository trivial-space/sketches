import { val } from 'tvs-flow/lib/utils/entity-reference'
import vert from './light-vert.glsl'
import frag from './light-frag.glsl'


export const spec = val({
	vert, frag
}).reset()

