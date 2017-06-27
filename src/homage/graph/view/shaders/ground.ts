import { val } from 'tvs-flow/lib/utils/entity-reference'
import vert from './ground-vert.glsl'
import frag from './ground-frag.glsl'


export const spec = val({
	vert, frag
}).reset()

