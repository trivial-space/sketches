import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import vert from './geo-vert.glsl'
import frag from './geo-frag.glsl'
import light from './light-frag.glsl'


export const geoSpec = val({
	vert, frag
}).reset()


export const lightFrag = val(light).reset()
