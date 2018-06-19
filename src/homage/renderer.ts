import * as videos from './state/videos'
import * as ground from './state/ground'
import * as screens from './state/screens'
import * as pedestals from './state/pedestals'
import { zip, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { makeClear } from 'tvs-painter/dist/lib/utils/context'
import { painter, gl } from './context'
import * as cam from './camera'
import { getStaticLayer, getSketch, getDrawingLayer } from 'shared-utils/painterState'
import { groundShade, screenShade, objectShade } from './shaders'
import { planeForm, planeSize, boxForm } from './geometries'
import { effectLayer } from './effects'
import { canvasSize } from './events'


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


// Sketches

export const groundSketch = getSketch(painter, 'ground')
	.update({
		form: planeForm,
		shade: groundShade,
		uniforms: {
			reflection: null,
			transform: ground.transform,
			lights: flatten(zip((p, r) => [...p, r], screens.positions, screens.rotations)),
			lightSize: [planeSize.width * screens.scale[0], planeSize.height * screens.scale[1]],
			lightTex: videoTextures.map(v => v.texture()),
			size: canvasSize
		}
	})


export const screenSketch = getSketch(painter, 'screens')
	.update({
		form: planeForm,
		shade: screenShade,
		uniforms: zip((transform, tex) => ({
			transform,
			video: tex.texture()
		}), screens.transforms, videoTextures)
	})


export const pedestalSketch = getSketch(painter, 'pedestals')
	.update({
		form: boxForm,
		shade: objectShade,
		uniforms: pedestals.transforms.map(transform => ({
			transform
		}))
	})


// Layers

const drawSettings = {
	clearBits: makeClear(gl, 'color', 'depth')
}


export const sceneLayer = getDrawingLayer(painter, 'scene')
	.update({
		sketches: [screenSketch, pedestalSketch, groundSketch],
		drawSettings,
		uniforms: {
			view: cam.camera.state.view,
			projection: cam.camera.state.perspective,
			withDistance: 0,
			groundHeight: 0
		}
	})


export const mirrorSceneLayer = getDrawingLayer(painter, 'mirrorScene')
	.update({
		flipY: true,
		sketches: [screenSketch, pedestalSketch],
		drawSettings,
		uniforms: {
			view: cam.groundMirrorView,
			projection: cam.camera.state.perspective,
			withDistance: 1,
			groundHeight: ground.position[1]
		}
	})


export const layers = [
	mirrorSceneLayer,
	effectLayer,
	sceneLayer
]
