import groundFrag from './glsl/ground-frag.glsl'
import groundVert from './glsl/ground-vert.glsl'
import objectFrag from './glsl/object-frag.glsl'
import objectVert from './glsl/object-vert.glsl'
import screenFrag from './glsl/screen-frag.glsl'
import screenVert from './glsl/screen-vert.glsl'
import { getShade } from 'shared-utils/painterState'
import { painter } from './context'


export const groundShade = getShade(painter, 'ground')
	.update({ vert: groundVert, frag: groundFrag })

export const objectShade = getShade(painter, 'object')
	.update({ vert: objectVert, frag: objectFrag })

export const screenShade = getShade(painter, 'screen')
	.update({ vert: screenVert, frag: screenFrag })
