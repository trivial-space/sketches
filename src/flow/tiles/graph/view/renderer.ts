import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { painter, gl } from './context'
import * as plane from './geometries/plane'
import * as tiles from '../state/tiles'
import * as init from '../state/init'
import * as shader from './shaders/base'
import * as events from '../events'
import * as camera from './camera'
import {
	makeShadeEntity,
	makeFormEntity,
	makeSketchEntity,
	makeDrawingLayerEntity
} from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import {
	Layer,
	LayerData,
	DrawSettings,
	SketchData
} from 'tvs-painter/dist/lib'

// ===== Settings =====

export const settings = stream(
	[gl.HOT],
	gl =>
		({
			clearColor: [1, 1, 1, 1],
			enable: [gl.DEPTH_TEST, gl.CULL_FACE]
		} as DrawSettings)
)

painter.react([settings.HOT], (painter, settings) =>
	painter.updateDrawSettings(settings)
)

// ===== shaders =====

export const shade = makeShadeEntity(painter, shader.spec)

// ===== geometries =====

export const form = makeFormEntity(painter, plane.geometry)

// ===== textures =====

export const textures = stream(
	[painter.HOT, init.images.HOT],
	(painter, imgs) =>
		imgs.reduce(
			(obj, [key, img]) => {
				obj[key] = painter.createStaticLayer().update({
					minFilter: 'LINEAR',
					magFilter: 'LINEAR',
					asset: img
				})
				return obj
			},
			{} as { [key: string]: Layer }
		)
)

// ===== objects =====

export const tilesData = stream(
	[form.HOT, shade.HOT, textures.HOT, tiles.activeTiles.HOT],
	(form, shade, textures, tiles) =>
		({
			form,
			shade,
			uniforms: tiles.map(tile => ({
				transform: tile.transform,
				image: textures[tile.tileSpecId].texture(),
				color: tile.color,
				connections: tile.connections
			}))
		} as SketchData)
)

export const tilesSketch = makeSketchEntity(painter, tilesData)

// ===== layers =====

export const sceneData = stream(
	[tilesSketch.HOT, camera.view.HOT, camera.perspective.HOT],
	(tiles, view, projection) =>
		({
			sketches: [tiles],
			uniforms: {
				view,
				projection
			}
		} as LayerData)
)

export const scene = makeDrawingLayerEntity(painter, sceneData)

// ===== render =====

export const render = stream(
	[painter.COLD, scene.COLD, events.tick.HOT],
	(painter, scene, _) => painter.compose(scene)
)
