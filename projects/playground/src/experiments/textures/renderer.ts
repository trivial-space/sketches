import {
	getEffect,
	getFrame,
	addSystem,
	set,
	getForm,
	getShade,
	getSketch,
} from '../../shared-utils/painterState'
import { painter, events, State, state } from './context'
import { noiseShader } from './shaders'
import { mat4 } from 'gl-matrix'
import { makeXYPlane } from '../../shared-utils/geometry-helpers'
import { planeFrag, planeVert } from './plane-shaders'
import { initPerspectiveViewport } from '../../shared-utils/vr/perspectiveViewport'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { createMirrorScene } from '../../shared-utils/vr/mirror-scene'

initPerspectiveViewport({
	position: [0, 3, -11],
	rotationY: Math.PI,
})

// === plane ===

const planeForm = getForm(painter, 'plane').update(makeXYPlane(5, 2))

const planeMatrix = mat4.create()
mat4.translate(planeMatrix, planeMatrix, [0, 5.5, 5])

const planeShade = getShade(painter, 'plane').update({
	frag: planeFrag,
	vert: planeVert,
})

// ===== layers =====

const noise = getEffect(painter, 'noise').update({
	frag: noiseShader,
	drawSettings: {
		clearBits: makeClear(painter.gl, 'color', 'depth'),
	},
})

export const noiseFrame = getFrame(painter, 'noise').update({
	layers: noise,
})

export const noiseSketch = getSketch(painter, 'noise').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseFrame.image(),
		transform: planeMatrix,
	},
})

export const scene = createMirrorScene(painter, state, [noiseSketch], {
	scale: 0.5,
	reflectionStrength: 0.5,
})

set<State>('time', 0)

addSystem<State>('renderer', (e, s) => {
	const d = s.device
	if (e === events.FRAME) {
		s.time += d.tpf / 10000
		noise.update({
			uniforms: {
				resolution: [d.canvas.width, d.canvas.height],
				time: s.time,
			},
		})
	}
	if (e === events.RESIZE) {
		noiseFrame.update()
	}
})
