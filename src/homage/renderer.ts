import * as videos from './state/videos'
import { zip } from 'tvs-libs/dist/lib/utils/sequence'
import { makeClear } from 'tvs-painter/dist/lib/utils/context'
import { painter, gl, state, getCanvasSize } from './context'
import { getStaticLayer, getSketch, getDrawingLayer, getEffectLayer } from 'shared-utils/painterState'
import { groundShade, screenShade, objectShade } from './shaders'
import { planeForm, boxForm } from './geometries'
import { effectLayer } from './effects'
import refFrag from './glsl/video-light-source.glsl'

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1]
})


// Textures

export const videoTextures = videos.names.map(
	n => getStaticLayer(painter, n).update({
		flipY: true,
		minFilter: 'LINEAR',
		wrap: 'CLAMP_TO_EDGE'
	})
)


const reflSize = [256, 256]
const videoLight = videoTextures.map(
	(t, i) => getEffectLayer(painter, 'vref' + i).update({
		buffered: true,
		width: 256,
		height: 256,
		minFilter: 'LINEAR',
		magFilter: 'LINEAR',
		frag: refFrag,
		drawSettings: {
			disable: [gl.DEPTH_TEST]
		},
		uniforms: [{
			source: () => t.texture(),
			direction: 0,
			strength: 4,
			size: reflSize
		}, {
			source: null,
			direction: 0,
			strength: 2,
			size: reflSize
		}, {
			source: null,
			direction: 0,
			strength: 1,
			size: reflSize
		}, {
			source: null,
			direction: 1,
			strength: 4,
			size: reflSize
		}, {
			source: null,
			direction: 1,
			strength: 2,
			size: reflSize
		}, {
			source: null,
			direction: 1,
			strength: 1,
			size: reflSize
		}]
	})
)

// Sketches

const groundSketch = getSketch(painter, 'ground')
	.update({
		form: planeForm,
		shade: groundShade,
		uniforms: {
			reflection: null,
			transform: () => state.ground.transform,
			lights: () => state.screens.lights,
			lightSize: () => state.screens.lightSize,
			lightTex: () => videoLight.map(v => v.texture()),
			size: getCanvasSize
		}
	})


const screenSketch = getSketch(painter, 'screens')
	.update({
		form: planeForm,
		shade: screenShade,
		uniforms: zip((transform, tex) => ({
			transform,
			video: () => tex.texture()
		}), state.screens.screenTransforms, videoTextures)
	})


const pedestalSketch = getSketch(painter, 'pedestals')
	.update({
		form: boxForm,
		shade: objectShade,
		uniforms: state.screens.pedestalTransforms.map(transform => ({
			transform
		}))
	})


// Layers

const drawSettings = {
	clearBits: makeClear(gl, 'color', 'depth')
}


const sceneLayer = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [screenSketch, pedestalSketch, groundSketch],
		drawSettings,
		uniforms: {
			view: () => state.viewPort.camera.viewMat,
			projection: () => state.viewPort.camera.projectionMat,
			withDistance: 0,
			groundHeight: 0
		}
	})


const mirrorSceneLayer = getDrawingLayer(painter, 'mirrorScene')
	.update({
		flipY: true,
		sketches: [screenSketch, pedestalSketch],
		drawSettings,
		uniforms: {
			view: () => state.ground.groundMirrorView,
			projection: () => state.viewPort.camera.projectionMat,
			withDistance: 1,
			groundHeight: () => state.ground.position[1]
		}
	})


export const layers = [
	...videoLight,
	mirrorSceneLayer,
	effectLayer,
	sceneLayer
]
