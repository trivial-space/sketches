import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import * as geometries from './geometries'
import * as init from '../state/init'
import * as shaders from './shaders'
import * as camera from './camera'
import { makeShadeEntity, makeFormEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import { DrawSettings } from 'tvs-painter/dist/lib'
import { gl, painter } from './context'


// ===== Settings =====

export const settings = stream(
	[gl.HOT],
	gl => ({
		clearColor: [0, 0, 0, 1],
		enable: [gl.DEPTH_TEST]
	} as DrawSettings))


painter.react(
	[settings.HOT],
	(painter, settings) => painter.updateDrawSettings(settings)
)


// ===== shaders =====

export const shade = makeShadeEntity(painter, shaders.base)


// ===== geometries =====

export const wallsForm = makeFormEntity(painter, geometries.walls)

export const floorForm = makeFormEntity(painter, geometries.ground)


// ===== objects =====

export const wallsSketch = makeSketchEntity(painter)
	.react(
		[wallsForm.HOT, shade.HOT, init.transform.HOT, gl.HOT],
		(s, form, shade, transform, gl) => s.update({
			form, shade,
			uniforms: {
				transform
			},
			drawSettings: {
				clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
			}
		})
	)

export const groundSketch = makeSketchEntity(painter)
	.react(
		[floorForm.HOT, shade.HOT, init.transformFloor.HOT, gl.HOT],
		(s, form, shade, transform, gl) => s.update({
			form, shade,
			uniforms: {
				transform
			},
			drawSettings: {
				clearBits: gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT
			}
		})
	)


// ===== layers =====

export const scene = makeDrawingLayerEntity(painter)
.react(
	[wallsSketch.HOT, groundSketch.HOT, camera.view.HOT, camera.perspective.HOT],
	(s, _walls, ground, view, projection) => s.update({
		sketches: [_walls, ground],
		uniforms: {
			view,
			projection
		}
	})
)


// ===== render =====

export const render = stream(
	[painter.COLD, scene.HOT],
	(painter, scene) => painter.compose(scene)
)
