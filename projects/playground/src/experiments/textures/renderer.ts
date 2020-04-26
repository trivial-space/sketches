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
import { noiseShader, noise2Shader } from './shaders'
import { mat4 } from 'gl-matrix'
import { makeXYPlane } from '../../shared-utils/geometry-helpers'
import { planeFrag, planeVert } from './plane-shaders'
import { initPerspectiveViewport } from '../../shared-utils/vr/perspectiveViewport'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { createMirrorScene } from '../../shared-utils/vr/mirror-scene'
import { getNoiseTextureData } from '../../shared-utils/texture-helpers'

initPerspectiveViewport({
	position: [0, 3, -15],
	rotationY: Math.PI,
	lookSpeed: 3,
})

// === plane ===

const planeForm = getForm(painter, 'plane').update(makeXYPlane(5, 2))

const planeShade = getShade(painter, 'plane').update({
	frag: planeFrag,
	vert: planeVert,
})

// === noise shader ===

const noisePlaneMatrix = mat4.create()
mat4.translate(noisePlaneMatrix, noisePlaneMatrix, [0, 5.5, 5])

const noise = getEffect(painter, 'noise').update({
	frag: noiseShader,
	drawSettings: {
		clearBits: makeClear(painter.gl, 'color', 'depth'),
	},
	uniforms: {
		time: () => state.time,
		resolution: () => [256, 256],
	},
})

export const noiseFrame = getFrame(painter, 'noise').update({
	layers: noise,
	width: 256,
	height: 256,
})

export const noiseSketch = getSketch(painter, 'noise').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseFrame.image(),
		transform: noisePlaneMatrix,
	},
})

// === noise static texture ===

const noiseTexPlaneMatrix = mat4.create()
mat4.translate(noiseTexPlaneMatrix, noiseTexPlaneMatrix, [11, 5.5, 5])

export const noiseTexFrame = getFrame(painter, 'noiseTex').update({
	texture: getNoiseTextureData({
		width: 256,
		height: 256,
		startX: 3,
		startY: 3,
		data: {
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
			wrap: 'REPEAT',
		},
	}),
})

export const noiseTexSketch = getSketch(painter, 'noiseTex').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseTexFrame.image(),
		transform: noiseTexPlaneMatrix,
	},
})

// === noise shader ===

const noiseTex2PlaneMatrix = mat4.create()
mat4.translate(noiseTex2PlaneMatrix, noiseTex2PlaneMatrix, [-11, 5.5, 5])

const noiseTex2 = getEffect(painter, 'noiseTex2').update({
	frag: noise2Shader,
	drawSettings: {
		clearBits: makeClear(painter.gl, 'color', 'depth'),
	},
	uniforms: {
		time: () => state.time,
		resolution: () => [256, 256],
		noiseTex: () => noiseTexFrame.image(),
	},
})

export const noiseTex2Frame = getFrame(painter, 'noiseTex2').update({
	layers: noiseTex2,
	width: 256,
	height: 256,
})

export const noiseTex2Sketch = getSketch(painter, 'noiseTex2').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseTex2Frame.image(),
		transform: noiseTex2PlaneMatrix,
	},
})

// === scene ===

export const scene = createMirrorScene(
	painter,
	state,
	[noiseSketch, noiseTexSketch, noiseTex2Sketch],
	{
		scale: 0.5,
		reflectionStrength: 0.5,
	},
)

set<State>('time', 0)

addSystem<State>('renderer', (e, s) => {
	const d = s.device
	if (e === events.FRAME) {
		s.time += d.tpf / 10000
	}
	if (e === events.RESIZE) {
		noiseFrame.update()
	}
})
