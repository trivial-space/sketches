import { Q } from './context'
import groundFrag from './glsl/ground-frag.glsl'
import groundVert from './glsl/ground-vert.glsl'
import objectFrag from './glsl/object-frag.glsl'
import objectVert from './glsl/object-vert.glsl'
import screenFrag from './glsl/screen-frag.glsl'
import screenVert from './glsl/screen-vert.glsl'

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
