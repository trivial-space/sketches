import { stream } from 'tvs-flow/lib/utils/entity-reference'
import { makeFormEntity, makeShadeEntity, makeSketchEntity, makeDrawingLayerEntity, makeEffectLayerEntity } from 'tvs-libs/lib/vr/flow-painter-utils'
import { painter, gl } from './painter'
import * as events from './events'
import * as camera from './camera'
import * as box from './geometries/box'
import * as plane from './geometries/plane'
import { makeClear } from 'tvs-renderer/lib/utils/context'
import { groundTransform, lightTransform, groundColor, lightColor } from './state'
import { DrawSettings } from 'tvs-renderer/lib'
import { geoSpec, lightFrag } from './shaders/shaders'


// Forms

export const boxForm = makeFormEntity(painter, box.geometry)

export const planeForm = makeFormEntity(painter, plane.geometry)


// Shades

export const geoShade = makeShadeEntity(painter, geoSpec)


// Textures


// Sketches

export const groundSketch = makeSketchEntity(painter)
.react(
	[groundTransform.HOT, groundColor.HOT, geoShade.HOT, planeForm.HOT],
	(sketch, transform, color, shade, form) => sketch.update({
		form, shade,
		uniforms: {
			transform,
			color
		}
	})
)


export const lightSketch = makeSketchEntity(painter)
.react(
	[lightTransform.HOT, lightColor.HOT, geoShade.HOT, planeForm.HOT],
	(sketch, transform, color, shade, form) => sketch.update({
		form, shade,
		uniforms: {
			transform,
			color
		}
	})
)


// Layers


export const drawSettings = stream(
	[gl.HOT],
	gl => ({
		clearBits: makeClear(gl, 'color', 'depth')
	} as DrawSettings)
)


export const sceneLayer = makeDrawingLayerEntity(painter)
.react(
	[
		gl.HOT,
		lightSketch.HOT,
		groundSketch.HOT,
		camera.view.COLD,
		camera.perspective.COLD,
		drawSettings.HOT
	],
	(layer, gl, light, ground, view, projection, settings) => layer.update({
		buffered: true,
		textureConfig: {
			count: 4,
			type: gl.FLOAT
		},
		sketches: [light, ground],
		drawSettings: settings,
		uniforms: {
			view, projection
		},
		wrap: 'CLAMP_TO_EDGE',
		minFilter: 'NEAREST',
		magFilter: 'NEAREST'
	})
)


export const lightLayer = makeEffectLayerEntity(painter)
	.react([
		camera.position.HOT,
		lightTransform.HOT,
		sceneLayer.HOT,
		camera.view.COLD,
		gl.HOT,
		lightFrag.HOT
	], (layer, eyePosition, lightMat, scene, view, gl, frag) => layer.update({
		frag,
		uniforms: {
			eyePosition,
			lightMat,
			view,
			positions: scene.texture(0),
			normals: scene.texture(1),
			uvs: scene.texture(2),
			colors: scene.texture(3)
		},
		drawSettings: {
			disable: [gl.DEPTH_TEST],
			enable: [gl.BLEND],
			clearBits: makeClear(gl, 'color')
		}
	})
)


painter.react(
	[sceneLayer.COLD, lightLayer.COLD, events.tick.HOT],
	(p, scene, light) => p.compose(scene, light)
)