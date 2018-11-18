import {
	asyncStreamStart,
	stream,
	val,
} from 'tvs-flow/dist/lib/utils/entity-reference'
import { DrawSettings, TextureData } from 'tvs-painter/dist'
import { makeClear } from 'tvs-painter/dist/utils/context'
import {
	makeDrawingLayerEntity,
	makeEffectLayerEntity,
	makeFormEntity,
	makeShadeEntity,
	makeSketchEntity,
	makeStaticLayerEntity,
} from 'tvs-utils/dist/vr/flow-painter-utils'
import * as camera from './camera'
import * as events from './events'
import * as plane from './geometries/plane'
import { gl, painter } from './painter'
import { geoSpec, lightFrag } from './shaders/shaders'
import {
	groundColor,
	groundTransform,
	lightBackColor,
	lightColor,
	lightTransforms,
} from './state'

// Forms

export const planeForm = makeFormEntity(painter, plane.geometry)

// Shades

export const geoShade = makeShadeEntity(painter, geoSpec)

// Textures

export const image = asyncStreamStart<HTMLImageElement>([], send => {
	const img = new Image()
	img.onload = () => send(img)
	img.src = 'tree.jpg'
})

export const textureData = val({
	minFilter: 'LINEAR_MIPMAP_LINEAR',
	magFilter: 'LINEAR',
} as TextureData).react([image.HOT], (tex, img) => ({
	...tex,
	asset: img,
}))

export const texture = makeStaticLayerEntity(painter, textureData)

// Sketches

export const groundSketch = makeSketchEntity(painter).react(
	[groundTransform.HOT, groundColor.HOT, geoShade.HOT, planeForm.HOT],
	(sketch, transform, color, shade, form) =>
		sketch.update({
			form,
			shade,
			uniforms: {
				transform,
				color,
			},
		}),
)

export const lightSketch = makeSketchEntity(painter).react(
	[
		lightTransforms.COLD,
		lightColor.HOT,
		lightBackColor.HOT,
		geoShade.HOT,
		planeForm.HOT,
		gl.HOT,
	],
	(sketch, [frontMat, backMat], color, backColor, shade, form, gl) =>
		sketch.update({
			form,
			shade,
			uniforms: [
				{
					transform: frontMat,
					color,
				},
				{
					transform: backMat,
					color: backColor,
				},
			],
			drawSettings: {
				enable: [gl.CULL_FACE],
			},
		}),
)

// Layers

export const drawSettings = stream(
	[gl.HOT],
	gl =>
		({
			clearBits: makeClear(gl, 'color', 'depth'),
		} as DrawSettings),
)

export const sceneLayer = makeDrawingLayerEntity(painter).react(
	[
		gl.HOT,
		lightSketch.HOT,
		groundSketch.HOT,
		camera.view.COLD,
		camera.perspective.COLD,
		drawSettings.HOT,
	],
	(layer, gl, light, ground, view, projection, settings) =>
		layer.update({
			buffered: true,
			textureConfig: {
				count: 4,
				type: gl.FLOAT,
			},
			sketches: [light, ground],
			drawSettings: settings,
			uniforms: {
				view,
				projection,
			},
			wrap: 'CLAMP_TO_EDGE',
			minFilter: 'NEAREST',
			magFilter: 'NEAREST',
		}),
)

export const lightLayer = makeEffectLayerEntity(painter).react(
	[
		sceneLayer.HOT,
		camera.position.COLD,
		lightTransforms.COLD,
		camera.view.COLD,
		gl.HOT,
		texture.HOT,
		lightFrag.HOT,
	],
	(layer, scene, eyePosition, lightMats, view, gl, tex, frag) =>
		layer.update({
			frag,
			uniforms: {
				eyePosition,
				lightMat: lightMats[0],
				view,
				tex: tex.texture(),
				positions: scene.texture(0),
				normals: scene.texture(1),
				uvs: scene.texture(2),
				colors: scene.texture(3),
			},
			drawSettings: {
				disable: [gl.DEPTH_TEST],
				enable: [gl.BLEND],
				clearBits: makeClear(gl, 'color'),
			},
		}),
)

painter.react(
	[sceneLayer.COLD, lightLayer.COLD, events.tick.HOT],
	(p, scene, light) =>
		p.compose(
			scene,
			light,
		),
)
