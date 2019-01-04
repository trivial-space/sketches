import { mat4 } from 'gl-matrix'
import { getFrame, getLayer, getSketch } from 'shared-utils/painterState'
import { getBlurByAlphaEffect } from 'shared-utils/shaders/effects/blur'
import { zip } from 'tvs-libs/dist/utils/sequence'
import { TextureData } from 'tvs-painter'
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

export const videoTextureData: TextureData = {
	flipY: true,
	minFilter: 'LINEAR',
	wrap: 'CLAMP_TO_EDGE',
}

export const videoTextures = videos.names.map(n => getFrame(painter, n))

const reflSize = 256
export const videoLights = videoTextures.map((t, i) => {
	const id = 'vref' + i
	return getFrame(painter, id).update({
		bufferStructure: [
			{
				minFilter: 'LINEAR',
				magFilter: 'LINEAR',
			},
		],
		width: reflSize,
		height: reflSize,
		layers: getBlurByAlphaEffect(painter, id, {
			strength: 4,
			size: [reflSize, reflSize],
			startFrame: t,
		}),
	})
})

// Sketches

const groundSketch = getSketch(painter, 'ground').update({
	form: planeForm,
	shade: groundShade,
	uniforms: {
		reflection: () => mirrorScene.image(),
		transform: () => state.ground.transform,
		lights: () => state.screens.lights,
		lightSize: () => state.screens.lightSize,
		lightTex: () => videoLights.map(v => v.image()),
		size: getCanvasSize,
	},
})

const screenSketch = getSketch(painter, 'screens').update({
	form: planeForm,
	shade: screenShade,
	uniforms: zip(
		(transform, tex) => ({
			transform,
			video: () => tex.image(),
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
	strength: 4,
	strengthOffset: 0.3,
	blurRatioVertical: 3,
	size: [256, 256],
})

export const mirrorScene = getFrame(painter, 'mirror').update({
	layers: [mirrorSceneLayer, blurEffect],
	width: 256,
	height: 256,
	bufferStructure: [
		{
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
		},
	],
})

export const scene = getFrame(painter, 'scene').update({
	layers: sceneLayer,
})
