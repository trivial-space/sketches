import { mat4 } from 'gl-matrix'
import {
	getLayer,
	getSketch,
	getFrame,
} from 'shared-utils/painterState'
import { getBlurByAlphaEffect } from 'shared-utils/shaders/effects/blur'
import { zip } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { getCanvasSize, gl, painter, state } from './context'
import { boxForm, planeForm } from './geometries'
import { groundShade, objectShade, screenShade } from './shaders'
import * as videos from './state/videos'

// Settings

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
})

// Textures

export const videoTextures = videos.names.map(n =>
	getFrame(painter, n).update({
		flipY: true,
		minFilter: 'LINEAR',
		wrap: 'CLAMP_TO_EDGE',
	}),
)

const reflSize = [256, 256]
const videoLights = videoTextures.map((t, i) =>
	getBlurByAlphaEffect(painter, 'vref' + i, {
		strength: 4,
		size: reflSize,
		startLayer: t,
		layerOpts: {
			buffered: true,
			doubleBuffered: true,
			minFilter: 'LINEAR',
			magFilter: 'LINEAR',
		},
	}),
)

// Sketches

const groundSketch = getSketch(painter, 'ground').update({
	form: planeForm,
	shade: groundShade,
	uniforms: {
		reflection: null,
		transform: () => state.ground.transform,
		lights: () => state.screens.lights,
		lightSize: () => state.screens.lightSize,
		lightTex: () => videoLights.map(v => v.texture()),
		size: getCanvasSize,
	},
})

const screenSketch = getSketch(painter, 'screens').update({
	form: planeForm,
	shade: screenShade,
	uniforms: zip(
		(transform, tex) => ({
			transform,
			video: () => tex.texture(),
		}),
		state.screens.screenTransforms,
		videoTextures,
	),
})

const pedestalSketch = getSketch(painter, 'pedestals').update({
	form: boxForm,
	shade: objectShade,
	uniforms: state.screens.pedestalTransforms.map(transform => ({
		transform,
	})),
})

// Layers

const drawSettings = {
	clearBits: makeClear(gl, 'color', 'depth'),
}

const sceneLayer = getLayer(painter, 'scene').update({
	sketches: [screenSketch, pedestalSketch, groundSketch],
	drawSettings,
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat,
		withDistance: 0,
	},
})

const mirrorSceneLayer = getLayer(painter, 'mirrorScene').update({
	flipY: true,
	sketches: [screenSketch, pedestalSketch],
	drawSettings,
	uniforms: {
		view: () =>
			mat4.multiply(
				state.ground.groundMirrorView,
				state.viewPort.camera.viewMat,
				state.ground.mirrorMatrix as any,
			),
		projection: () => state.viewPort.camera.projectionMat,
		withDistance: 1,
		groundHeight: () => state.ground.position[1],
	},
})

const blurEffect = getBlurByAlphaEffect(painter, 'blur', {
	strength: 10,
	strengthOffset: 0.3,
	blurRatioVertical: 3,
})

export const layers = [...videoLights, mirrorSceneLayer, blurEffect, sceneLayer]
