import { stream } from 'tvs-flow/lib/utils/entity-reference'
import { makeFormEntity, makeShadeEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-libs/lib/vr/flow-painter-utils'
import { painter, gl } from './painter'
import * as events from './events'
import * as camera from './camera'
import * as box from './geometries/box'
import * as plane from './geometries/plane'
import * as groundShader from './shaders/ground'
import * as lightShader from './shaders/light'
import { makeClear } from 'tvs-renderer/lib/utils/context'
import { groundTransform, lightTransform } from './state'


// Forms

export const boxForm = makeFormEntity(painter, box.geometry)

export const planeForm = makeFormEntity(painter, plane.geometry)


// Shades

export const groundShade = makeShadeEntity(painter, groundShader.spec)

export const lightShade = makeShadeEntity(painter, lightShader.spec)


// Textures


// Sketches

export const groundSketch = makeSketchEntity(painter)
.react(
	[groundShade.HOT, planeForm.HOT, groundTransform.HOT],
	(sketch, shade, form, transform) => sketch.update({
		form, shade,
		uniforms: {
			transform
		}
	})
)


export const lightSketch = makeSketchEntity(painter)
.react(
	[lightShade.HOT, planeForm.HOT, lightTransform.HOT],
	(sketch, shade, form, transform) => sketch.update({
		form, shade,
		uniforms: {
			transform
		}
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
		lightSketch.HOT,
		groundSketch.HOT,
		drawSettings.HOT,
		camera.view.COLD,
		camera.perspective.COLD
	],
	(layer, light, ground, settings, view, projection) => layer.update({
		sketches: [light, ground],
		drawSettings: settings,
		uniforms: {
			view, projection
		}
	})
)


painter.react(
	[sceneLayer.COLD, events.tick.HOT],
	(p, scene, _) => p.compose(scene)
)
