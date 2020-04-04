import { mat4 } from 'gl-matrix'
import {
	getFrame,
	getLayer,
	getShade,
	getSketch,
} from '../shared-utils/painterState'
import { getBlurByAlphaEffect } from '../shared-utils/shaders/effects/blur'
import { canvas, gl, painter, state } from './context'
import { groundForm, wallsForm } from './geometries'
import groundFrag from './glsl/ground.frag'
import groundVert from './glsl/ground.vert'
import wallsFrag from './glsl/walls.frag'
import wallsVert from './glsl/walls.vert'
import {
	floorMirrorMatrix,
	floorMirrorView,
	floorTransform,
	wallsTransform,
} from './state'

// ===== Settings =====

painter.updateDrawSettings({
	enable: [gl.DEPTH_TEST],
})

// ===== Shaders =====

const wallsShade = getShade(painter, 'walls').update({
	vert: wallsVert,
	frag: wallsFrag,
})

const groundShade = getShade(painter, 'ground').update({
	vert: groundVert,
	frag: groundFrag,
})

// ===== objects =====

const wallsSketch = getSketch(painter, 'walls').update({
	form: wallsForm,
	shade: wallsShade,
	uniforms: {
		transform: wallsTransform,
	},
})

const groundSketch = getSketch(painter, 'ground').update({
	form: groundForm,
	shade: groundShade,
	uniforms: {
		transform: floorTransform,
		reflection: '0',
		size: () => [canvas.width, canvas.height],
	},
})

// ===== layers =====

const mirrorScene = getLayer(painter, 'mirror scene').update({
	sketches: [wallsSketch],
	uniforms: {
		view: () =>
			mat4.multiply(
				floorMirrorView,
				state.viewPort.camera.viewMat,
				floorMirrorMatrix as any,
			),
		projection: () => state.viewPort.camera.projectionMat,
	},
	drawSettings: {
		clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT,
	},
})

const scene = getLayer(painter, 'scene').update({
	sketches: [groundSketch, wallsSketch],
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat,
	},
	drawSettings: {
		clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT,
	},
})

const blurEffect = getBlurByAlphaEffect(painter, 'blur', {
	strength: 10,
	strengthOffset: 0.3,
	blurRatioVertical: 3,
})

export const main = getFrame(painter, 'main').update({
	layers: [mirrorScene, blurEffect, scene],
})
