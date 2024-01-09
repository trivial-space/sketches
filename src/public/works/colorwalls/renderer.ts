import { createMirrorScene } from '../../../shared-utils/vr/mirror-scene'
import { initPerspectiveViewport } from '../../../shared-utils/vr/perspectiveViewport'
import { Q } from './context'
import { wallsForm } from './geometries'
import wallsFrag from './glsl/walls.frag.glsl?raw'
import wallsVert from './glsl/walls.vert.glsl?raw'
import { wallsTransform } from './state'

initPerspectiveViewport(Q, {
	position: [0, 3.4, 25],
	fovy: Math.PI * 0.4,
	lookSpeed: 2,
})

// ===== Settings =====

Q.painter.updateDrawSettings({
	enable: [Q.gl.DEPTH_TEST],
})

const wallsShade = Q.getShade('walls').update({
	vert: wallsVert,
	frag: wallsFrag,
})

const wallsSketch = Q.getSketch('walls').update({
	form: wallsForm,
	shade: wallsShade,
	uniforms: {
		transform: wallsTransform,
	},
})

export const scene = createMirrorScene(Q, [wallsSketch], {
	scale: 0.4,
	blurRatioVertical: 2.5,
	blurStrenghOffset: 2.5,
})

scene.scene.update({ directRender: true })
