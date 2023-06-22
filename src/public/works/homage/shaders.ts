import { Q } from './context'
import groundFrag from './glsl/ground-frag.glsl?raw'
import groundVert from './glsl/ground-vert.glsl?raw'
import objectFrag from './glsl/object-frag.glsl?raw'
import objectVert from './glsl/object-vert.glsl?raw'
import screenFrag from './glsl/screen-frag.glsl?raw'
import screenVert from './glsl/screen-vert.glsl?raw'

export const groundShade = Q.getShade('ground').update({
	vert: groundVert,
	frag: groundFrag,
})

export const objectShade = Q.getShade('object').update({
	vert: objectVert,
	frag: objectFrag,
})

export const screenShade = Q.getShade('screen').update({
	vert: screenVert,
	frag: screenFrag,
})
