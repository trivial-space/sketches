import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import * as geometries from './geometries'
import * as init from '../state/init'
import * as shaders from './shaders'
import * as events from '../events'
import * as camera from './camera'
import { makeShadeEntity, makeFormEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import { DrawSettings } from 'tvs-painter/dist/lib'
import { gl, painter } from './context'



// ===== Settings =====

export const settings = stream(
	[gl.HOT],
	gl => ({
		clearColor: [1, 1, 1, 1],
		enable: [gl.DEPTH_TEST, gl.CULL_FACE]
	} as DrawSettings))


painter.react(
	[settings.HOT],
	(painter, settings) => painter.updateDrawSettings(settings)
)


// ===== shaders =====

export const shade = makeShadeEntity(painter, shaders.base)


// ===== geometries =====

export const form = makeFormEntity(painter, geometries.plane)


// ===== objects =====

export const tilesSketch = makeSketchEntity(painter)
.react(
	[form.HOT, shade.HOT, init.transform.HOT],
	(s, form, shade, transform) => s.update({
		form, shade,
		uniforms: {
			transform
		}
	})
)


// ===== layers =====

export const scene = makeDrawingLayerEntity(painter)
.react(
	[tilesSketch.HOT, camera.view.HOT, camera.perspective.HOT],
	(s, tiles, view, projection) => s.update({
		sketches: [tiles],
		uniforms: {
			view,
			projection
		}
	})
)


// ===== render =====

export const render = stream(
	[painter.COLD, scene.COLD, events.tick.HOT],
	(painter, scene, _) => painter.compose(scene)
)
