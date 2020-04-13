import { getShade, getSketch } from '../shared-utils/painterState'
import { gl, painter, state } from './context'
import { wallsForm } from './geometries'
import wallsFrag from './glsl/walls.frag'
import wallsVert from './glsl/walls.vert'
import { wallsTransform } from './state'
import { initPerspectiveViewport } from '../shared-utils/vr/perspectiveViewport'
import { createMirrorScene } from '../shared-utils/vr/mirror-scene'

initPerspectiveViewport({
	position: [0, 3.4, 25],
	fovy: Math.PI * 0.4,
	lookSpeed: 0.15,
})

// ===== Settings =====

painter.updateDrawSettings({
	enable: [gl.DEPTH_TEST],
})

const wallsShade = getShade(painter, 'walls').update({
	vert: wallsVert,
	frag: wallsFrag,
})

const wallsSketch = getSketch(painter, 'walls').update({
	form: wallsForm,
	shade: wallsShade,
	uniforms: {
		transform: wallsTransform,
	},
})

export const scene = createMirrorScene(painter, state, [wallsSketch], {
	scale: 0.4,
	blurRatioVertical: 2.5,
	blurStrenghOffset: 2.5,
})
