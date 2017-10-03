import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { makeFormEntity, makeShadeEntity, makeSketchEntity, makeDrawingLayerEntity, makeEffectLayerEntity } from 'tvs-libs/dist/lib/vr/flow-painter-utils'
import * as events from '../events'
import * as videos from '../videos'
import * as camera from './camera'
import * as box from './geometries/box'
import * as plane from './geometries/plane'
import * as reflectionShader from './shaders/ground-reflection'
import * as groundShader from './shaders/ground'
import * as objectShader from './shaders/object'
import * as screenShader from './shaders/screen'
import * as ground from '../state/ground'
import * as screens from '../state/screens'
import * as pedestals from '../state/pedestals'
import * as reflectionEffect from './effects/ground-reflection'
import { zip } from 'tvs-libs/dist/lib/utils/sequence'
import { makeClear } from 'tvs-painter/dist/lib/utils/context'
import { defined } from 'tvs-libs/dist/lib/utils/predicates'
import { painter, canvasSize, gl } from './painter'


// Forms

export const boxForm = makeFormEntity(painter, box.geometry)

export const planeForm = makeFormEntity(painter, plane.geometry)


// Shades

export const groundShade = makeShadeEntity(painter, groundShader.spec)

export const objectShade = makeShadeEntity(painter, objectShader.spec)

export const screenShade = makeShadeEntity(painter, screenShader.spec)


// Textures

export const videoTextures = stream(
	[painter.HOT, videos.names.HOT],
	(painter, videos) => videos.map(
		() => painter.createStaticLayer().update({
			flipY: true,
			minFilter: 'LINEAR',
			wrap: 'CLAMP_TO_EDGE'
		})
	)
)
.react(
	[videos.videos.HOT, events.slowTick.HOT],
	(ts, vs, _) => {
		ts.forEach((t, i) => t.update({asset: vs[i]}))
	}
).accept(defined)



// Sketches

export const groundSketch = makeSketchEntity(painter)
.react(
	[groundShade.HOT, planeForm.HOT, ground.transform.HOT, canvasSize.HOT, screens.positions.HOT, screens.rotations.HOT],
	(sketch, shade, form, transform, size, lightPositions, lightRotations) => sketch.update({
		form, shade,
		uniforms: {
			transform,
			lightPositions: [].concat.apply([], lightPositions),
			lightRotations,
			reflection: null,
			size: [size.width, size.height]
		}
	})
)


export const screenSketch = makeSketchEntity(painter)
.react(
	[screenShade.HOT, planeForm.HOT, screens.transforms.HOT, videoTextures.HOT],
	(sketch, shade, form, transforms, textures) => sketch.update({
		form, shade,
		uniforms: zip(transforms, textures, (transform, tex) => ({
			transform,
			video: tex.texture()
		}))
	})
)


export const pedestalSketch = makeSketchEntity(painter)
.react(
	[objectShade.HOT, boxForm.HOT, pedestals.transforms.HOT],
	(sketch, shade, form, transforms) => sketch.update({
		form, shade,
		uniforms: transforms.map(transform => ({
			transform
		}))
	})
)


// Layers


export const drawSettings = stream(
	[gl.HOT],
	gl => ({
		clearBits: makeClear(gl, 'color', 'depth')
	})
)

export const sceneLayer = makeDrawingLayerEntity(painter)
.react(
	[
		screenSketch.HOT,
		pedestalSketch.HOT,
		groundSketch.HOT,
		drawSettings.HOT,
		camera.view.COLD,
		camera.perspective.COLD
	],
	(layer, screens, pedestals, ground, settings, view, projection) => layer.update({
		sketches: [screens, pedestals, ground],
		drawSettings: settings,
		uniforms: {
			view, projection,
			withDistance: 0,
			groundHeight: 0
		}
	})
)


export const mirrorSceneLayer = makeDrawingLayerEntity(painter)
.react(
	[
		screenSketch.HOT,
		pedestalSketch.HOT,
		ground.position.HOT,
		drawSettings.HOT,
		camera.groundMirrorView.COLD,
		camera.perspective.COLD
	],
	(layer, screens, pedestals, groundPos, settings, view, projection) => layer.update({
		flipY: true,
		sketches: [screens, pedestals],
		drawSettings: settings,
		uniforms: {
			view, projection,
			withDistance: 1,
			groundHeight: groundPos[1]
		}
	})
)


export const effectSettings = stream(
	[gl.HOT],
	gl => ({
		disable: [gl.DEPTH_TEST]
	})
)


export const effectLayer = makeEffectLayerEntity(painter)
.react(
	[
		reflectionEffect.layersData.HOT,
		reflectionShader.frag.HOT,
		canvasSize.HOT,
		effectSettings.HOT
	],
	(layer, layerData, frag, size, settings) => layer.update({
		frag,
		drawSettings: settings,
		uniforms: layerData.map(d => ({
			source: null,
			...d,
			size: [size.width, size.height]
		}))
	})
)


export const layers = stream(
	[mirrorSceneLayer.HOT, effectLayer.HOT, sceneLayer.HOT],
	(mirrorScene, effect, scene) => [
		[mirrorScene, true],
		[effect, true],
		[scene, true]
	].filter(l => l[1]).map(l => l[0])
)


painter.react(
	[layers.COLD, events.tick.HOT],
	(p, layers, _) => p.compose.apply(null, layers)
)
