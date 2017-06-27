import { stream } from 'tvs-flow/lib/utils/entity-reference'
import { makeFormEntity, makeShadeEntity, makePainterCanvas, makeSketchEntity, makeDrawingLayerEntity, makeEffectLayerEntity } from 'tvs-libs/lib/vr/flow-painter-utils'
import * as events from '../events'
import * as videos from '../videos'
import * as camera from 'homage/graph/view/camera'
import * as box from 'homage/graph/view/geometries/box'
import * as plane from 'homage/graph/view/geometries/box'
import * as reflectionShader from 'homage/graph/view/shaders/ground-reflection'
import * as groundShader from 'homage/graph/view/shaders/ground'
import * as objectShader from 'homage/graph/view/shaders/object'
import * as screenShader from 'homage/graph/view/shaders/screen'
import * as ground from '../state/ground'
import * as screens from '../state/screens'
import * as pedestals from '../state/pedestals'
import * as reflectionEffect from './effects/ground-reflection'
import { zip } from 'tvs-libs/lib/utils/sequence'


export const {canvas, painter, gl, canvasSize} =
	makePainterCanvas(events.windowSize)


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
			flipY: true
		})
	)
)
.react(
  [videos.videos.HOT, events.slowTick.HOT],
  (ts, vs, _) => {
    ts.forEach((t, i) => t.update({asset: vs[i]}))
		return ts
  }
)



// Sketches

export const groundData = stream(
	[groundShade.HOT, planeForm.HOT, ground.transform.HOT, canvasSize.HOT],
	(shade, form, transform, size) => ({
		form, shade,
		uniforms: {
			transform,
			size: [size.width, size.height]
		}
	})
)

export const groundSketch = makeSketchEntity(painter, groundData)


export const screenData = stream(
	[screenShade.HOT, boxForm.HOT, screens.transforms.HOT, videoTextures.HOT],
	(shade, form, transforms, textures) => ({
		form, shade,
		uniforms: zip(transforms, textures, (transform, tex) => ({
			transform,
			video: tex.texture()
		}))

	})
)

export const screenSketch = makeSketchEntity(painter, groundData)

export const pedestalData = stream(
	[objectShade.HOT, boxForm.HOT, pedestals.transforms.HOT],
	(shade, form, transforms) => ({
		form, shade,
		uniforms: transforms.map(transform => ({
			transform
		}))
	})
)

export const pedestalSketch = makeSketchEntity(painter, groundData)


export const sceneData = stream(
	[
		screenSketch.HOT,
		pedestalSketch.HOT,
		groundSketch.HOT,
		camera.view.COLD,
		camera.perspective.COLD
	],
	(screens, pedestals, ground, view, projection) => ({
		sketches: [screens, pedestals, ground],
		uniforms: {
			view, projection,
			withDistance: 0,
			groundHeight: 0
		}
	})
)

export const sceneLayer = makeDrawingLayerEntity(painter, sceneData)


export const mirrorSceneData = stream(
	[
		screenSketch.HOT,
		pedestalSketch.HOT,
		ground.position.HOT,
		camera.view.COLD,
		camera.perspective.COLD
	],
	(screens, pedestals, groundPos, view, projection) => ({
		sketches: [screens, pedestals],
		uniforms: {
			view, projection,
			withDistance: 1,
			groundHeight: groundPos[1]
		}
	})
)

export const mirrorSceneLayer = makeDrawingLayerEntity(painter, mirrorSceneData)


export const effectData = stream(
  [
    reflectionEffect.layersData.HOT,
    reflectionShader.frag.HOT,
    canvasSize.HOT
  ],
  (layerData, frag, size) => ({
		frag,
		uniforms: layerData.map(d => ({
			...d,
			size: [size.width, size.height]
		}))
	})
)

export const effectLayer = makeEffectLayerEntity(painter, effectData)


export const layers = stream(
	[mirrorSceneLayer.HOT, effectLayer.HOT, sceneLayer.HOT],
	(mirrorScene, effect, scene) => {
		return [mirrorScene, effect, scene]
	}
)


painter.react(
	[layers.HOT, events.tick.HOT],
	(p, layers, _) => p.compose.apply(null, layers)
)
