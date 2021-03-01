import { mat4 } from 'gl-matrix'
import { getBlurByAlphaEffect } from '../shared-utils/shaders/effects/blur'
import { zip } from 'tvs-libs/dist/utils/sequence'
import { TextureData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { events, getCanvasSize, Q } from './context'
import { boxForm, planeForm } from './geometries'
import { groundShade, objectShade, screenShade } from './shaders'
import * as videos from './state/videos'
import { initPerspectiveViewport } from '../shared-utils/vr/perspectiveViewport'

const { gl, state: s } = Q

initPerspectiveViewport(Q, {
	fovy: Math.PI * 0.4,
	lookSpeed: 2,
})

// Settings

Q.painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
})

// Textures

export const videoTextureData: TextureData = {
	flipY: true,
	minFilter: 'LINEAR',
	wrap: 'CLAMP_TO_EDGE',
}

export const videoTextures = videos.names.map((n) => Q.getFrame(n))

const reflSize = 256
export const videoLights = videoTextures.map((t, i) => {
	const id = 'vref' + i
	return Q.getFrame(id).update({
		bufferStructure: [
			{
				minFilter: 'LINEAR',
				magFilter: 'LINEAR',
			},
		],
		width: reflSize,
		height: reflSize,
		layers: getBlurByAlphaEffect(Q, id, {
			strength: 4,
			size: [reflSize, reflSize],
			startFrame: t,
		}),
	})
})

// Sketches

const groundSketch = Q.getSketch('ground').update({
	form: planeForm,
	shade: groundShade,
	uniforms: {
		reflection: () => mirrorScene.image(),
		transform: () => s.ground.transform,
		lights: () => s.screens.lights,
		lightSize: () => s.screens.lightSize,
		lightTex: () => videoLights.map((v) => v.image()),
		size: getCanvasSize,
	},
})

const screenSketch = Q.getSketch('screens').update({
	form: planeForm,
	shade: screenShade,
	uniforms: zip(
		(transform, tex) => ({
			transform,
			video: () => tex.image(),
		}),
		s.screens.screenTransforms,
		videoTextures,
	),
})

const pedestalSketch = Q.getSketch('pedestals').update({
	form: boxForm,
	shade: objectShade,
	uniforms: s.screens.pedestalTransforms.map((transform) => ({
		transform,
	})),
})

// Layers

const drawSettings = {
	clearBits: makeClear(gl, 'color', 'depth'),
}

const sceneLayer = Q.getLayer('scene').update({
	sketches: [screenSketch, pedestalSketch, groundSketch],
	drawSettings,
	uniforms: {
		view: () => s.viewPort.camera.viewMat,
		projection: () => s.viewPort.camera.projectionMat,
		withDistance: 0,
	},
})

const mirrorSceneLayer = Q.getLayer('mirrorScene').update({
	sketches: [screenSketch, pedestalSketch],
	drawSettings,
	uniforms: {
		view: () =>
			mat4.multiply(
				s.ground.groundMirrorView,
				s.viewPort.camera.viewMat,
				s.ground.mirrorMatrix as any,
			),
		projection: () => s.viewPort.camera.projectionMat,
		withDistance: 1,
		groundHeight: () => s.ground.position[1],
	},
})

const blurEffect = getBlurByAlphaEffect(Q, 'blur', {
	strength: 4,
	strengthOffset: 0.3,
	blurRatioVertical: 3,
	size: [256, 256],
})

export const mirrorScene = Q.getFrame('mirror').update({
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

export const scene = Q.getFrame('scene').update({
	layers: sceneLayer,
})

Q.listen('renderer', events.RESIZE, () => {
	scene.update()
})
