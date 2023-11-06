import { mat4 } from 'gl-matrix'
import { getBlurByAlphaEffect } from '../../../shared-utils/shaders/effects/blur'
import { zip } from 'tvs-libs/dist/utils/sequence'
import { TextureData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { events, getCanvasSize, Q } from './context'
import { boxForm, planeForm } from './geometries'
import { groundShade, objectShade, screenShade } from './shaders'
import * as videos from './state/videos'
import { initPerspectiveViewport } from '../../../shared-utils/vr/perspectiveViewport'
import * as screens from './state/screens'
import * as ground from './state/ground'

const { gl, state: s } = Q

initPerspectiveViewport(Q, {
	fovy: Math.PI * 0.4,
	lookSpeed: 2,
})

const drawSettings = {
	clearBits: makeClear(gl, 'color', 'depth'),
}

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

export const videoTextures = videos.names.map((n) => Q.getLayer(n))

const reflSize = 256
export const videoLights = videoTextures.map((t, i) => {
	const id = 'vref' + i
	return Q.getLayer(id).update({
		bufferOptions: [
			{
				minFilter: 'LINEAR',
				magFilter: 'LINEAR',
			},
		],
		width: reflSize,
		height: reflSize,
		effects: getBlurByAlphaEffect(Q, id, {
			strength: 4,
			size: [reflSize, reflSize],
			startLayer: t,
		}),
	})
})

// Object sketches

export const screenSketch = Q.getSketch('screens').update({
	form: planeForm,
	shade: screenShade,
	uniforms: zip(
		(transform, tex) => ({
			transform,
			video: () => tex.image(),
		}),
		screens.screenTransforms,
		videoTextures,
	),
	drawSettings,
})

const pedestalSketch = Q.getSketch('pedestals').update({
	form: boxForm,
	shade: objectShade,
	uniforms: screens.pedestalTransforms.map((transform) => ({
		transform,
	})),
})

// MirrorLayer

const blurEffect = getBlurByAlphaEffect(Q, 'blur', {
	strength: 4,
	strengthOffset: 0.3,
	blurRatioVertical: 3,
	size: [256, 256],
})

export const mirrorScene = Q.getLayer('mirrorScene').update({
	sketches: [screenSketch, pedestalSketch],
	effects: blurEffect,
	drawSettings,
	uniforms: {
		view: () =>
			mat4.multiply(
				ground.groundMirrorView,
				s.viewPort.camera.viewMat,
				ground.mirrorMatrix as any,
			),
		projection: () => s.viewPort.camera.projectionMat,
		withDistance: 1,
		groundHeight: () => ground.position[1],
	},
	width: 256,
	height: 256,
	bufferOptions: [
		{
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
		},
	],
})

// Groundsketch

const groundSketch = Q.getSketch('ground').update({
	form: planeForm,
	shade: groundShade,
	uniforms: {
		reflection: () => mirrorScene.image(),
		transform: ground.transform,
		lights: screens.lights,
		lightSize: screens.lightSize,
		lightTex: () => videoLights.map((v) => v.image()),
		size: getCanvasSize,
	},
})

// Scene

export const scene = Q.getLayer('scene').update({
	sketches: [screenSketch, pedestalSketch, groundSketch],
	drawSettings,
	uniforms: {
		view: () => s.viewPort.camera.viewMat,
		projection: () => s.viewPort.camera.projectionMat,
		withDistance: 0,
	},
	directRender: true,
})

Q.listen('renderer', events.RESIZE, () => {
	scene.update()
})
