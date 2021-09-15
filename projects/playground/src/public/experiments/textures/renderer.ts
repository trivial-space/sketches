import { events, Q } from './context'
import { noiseShader, noise2Shader, lineShader } from './shaders'
import { mat4 } from 'gl-matrix'
import { makeXYPlane } from '../../../shared-utils/geometry/helpers'
import { planeFrag, planeVert } from './plane-shaders'
import { initPerspectiveViewport } from '../../../shared-utils/vr/perspectiveViewport'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { createMirrorScene } from '../../../shared-utils/vr/mirror-scene'
import { getNoiseTextureData } from '../../../shared-utils/texture-helpers'

initPerspectiveViewport(Q, {
	position: [0, 3, -15],
	rotationY: Math.PI,
	lookSpeed: 3,
})

// === plane ===

const planeForm = Q.getForm('plane').update(makeXYPlane(5, 2))

const planeShade = Q.getShade('plane').update({
	frag: planeFrag,
	vert: planeVert,
})

// === noise shader ===

const noisePlaneMatrix = mat4.create()
mat4.translate(noisePlaneMatrix, noisePlaneMatrix, [0, 5.5, 5])

const noise = Q.getEffect('noise').update({
	frag: noiseShader,
	drawSettings: {
		clearBits: makeClear(Q.gl, 'color', 'depth'),
	},
	uniforms: {
		time: () => Q.state.time,
		resolution: () => [256, 256],
	},
})

export const noiseLayer = Q.getLayer('noise').update({
	effects: noise,
	width: 256,
	height: 256,
})

export const noiseSketch = Q.getSketch('noise').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseLayer.image(),
		transform: noisePlaneMatrix,
	},
})

// === noise static texture ===

const noiseTexPlaneMatrix = mat4.create()
mat4.translate(noiseTexPlaneMatrix, noiseTexPlaneMatrix, [11, 5.5, 5])

export const noiseTex = Q.getLayer('noiseTex').update({
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

export const noiseTexSketch = Q.getSketch('noiseTex').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseTex.image(),
		transform: noiseTexPlaneMatrix,
	},
})

// === shader with static noice tex ===

const noiseTex2PlaneMatrix = mat4.create()
mat4.translate(noiseTex2PlaneMatrix, noiseTex2PlaneMatrix, [-11, 5.5, 5])

const noiseTex2Eff = Q.getEffect('noiseTex2').update({
	frag: noise2Shader,
	drawSettings: {
		clearBits: makeClear(Q.gl, 'color', 'depth'),
	},
	uniforms: {
		time: () => Q.state.time,
		resolution: () => [256, 256],
		noiseTex: () => noiseTex.image(),
	},
})

export const noiseTex2 = Q.getLayer('noiseTex2').update({
	effects: noiseTex2Eff,
	width: 256,
	height: 256,
})

export const noiseTex2Sketch = Q.getSketch('noiseTex2').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => noiseTex2.image(),
		transform: noiseTex2PlaneMatrix,
	},
})

// === line shader ===

const lineTexPlaneMatrix = mat4.create()
mat4.translate(lineTexPlaneMatrix, lineTexPlaneMatrix, [-22, 5.5, 5])

const lineTexEff = Q.getEffect('lineTex').update({
	frag: lineShader,
	drawSettings: {
		clearBits: makeClear(Q.gl, 'color', 'depth'),
	},
	uniforms: {
		time: () => Q.state.time,
		resolution: () => [256, 256],
		noiseTex: () => noiseTex.image(),
	},
})

export const lineTex = Q.getLayer('lineTex').update({
	effects: lineTexEff,
	width: 256,
	height: 256,
})

export const lineTexSketch = Q.getSketch('lineTex').update({
	form: planeForm,
	shade: planeShade,
	uniforms: {
		texture: () => lineTex.image(),
		transform: lineTexPlaneMatrix,
	},
})

// === scene ===

export const scene = createMirrorScene(
	Q,
	[noiseSketch, noiseTexSketch, noiseTex2Sketch, lineTexSketch],
	{
		scale: 0.5,
		reflectionStrength: 0.5,
	},
)

Q.set('time', 0)

Q.listen('renderer', events.FRAME, (s) => {
	const d = s.device
	s.time += d.tpf / 10000
})

Q.listen('renderer', events.RESIZE, () => {
	noiseLayer.update()
})
