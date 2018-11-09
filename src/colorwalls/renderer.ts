import { mat4 } from 'gl-matrix'
import { getDrawingLayer, getSketch } from 'shared-utils/painterState'
import { getShade } from 'shared-utils/painterState'
import { getBlurByAlphaEffect } from 'shared-utils/shaders/effects/blur'
import { canvas, gl, painter, state } from './context'
import { groundForm, wallsForm } from './geometries'
import groundFrag from './glsl/ground.frag'
import groundVert from './glsl/ground.vert'
import wallsFrag from './glsl/walls.frag'
import wallsVert from './glsl/walls.vert'
import * as init from './state'
import { floorMirrorMatrix, floorMirrorView } from './state'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
	enable: [gl.DEPTH_TEST]
})

// ===== Shaders =====

export const wallsShade = getShade(painter, 'walls').update({
	vert: wallsVert,
	frag: wallsFrag
})

export const groundShade = getShade(painter, 'ground').update({
	vert: groundVert,
	frag: groundFrag
})

// ===== objects =====

export const wallsSketch = getSketch(painter, 'walls').update({
	form: wallsForm,
	shade: wallsShade,
	uniforms: {
		transform: init.wallsTransform
	}
})

export const groundSketch = getSketch(painter, 'ground').update({
	form: groundForm,
	shade: groundShade,
	uniforms: {
		transform: init.floorTransform,
		reflection: null,
		size: () => [canvas.width, canvas.height]
	}
})

// ===== layers =====

export const mirrorScene = getDrawingLayer(painter, 'mirror scene').update({
	sketches: [wallsSketch],
	uniforms: {
		view: () =>
			mat4.multiply(
				floorMirrorView,
				state.viewPort.camera.viewMat,
				floorMirrorMatrix as any
			),
		projection: () => state.viewPort.camera.projectionMat
	},
	drawSettings: {
		clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
	}
})

export const scene = getDrawingLayer(painter, 'scene').update({
	sketches: [groundSketch, wallsSketch],
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat
	},
	drawSettings: {
		clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
	}
})

const blurEffect = getBlurByAlphaEffect(painter, 'blur', {
	strength: 10,
	strengthOffset: 0.3,
	blurRatioVertical: 3
})

export const layers = [mirrorScene, blurEffect, scene]
