import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { painter, gl, canvasSize } from './context'
import * as geometries from './geometries'
import * as shaders from './shaders'
import { makeShadeEntity, makeFormEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-utils/dist/lib/vr/flow-painter-utils'


// ===== shaders =====

export const pointsShade = makeShadeEntity(painter, shaders.point)



// ===== geometries =====

export const pointsForm = makeFormEntity(painter, geometries.points)



// ===== objects =====

export const pointsSketch = makeSketchEntity(painter)
.react(
	[pointsForm.HOT, pointsShade.HOT],
	(s, form, shade) => s.update({
		form, shade
	})
)


// ===== layers =====

export const scene = makeDrawingLayerEntity(painter)
.react(
	[pointsSketch.HOT, canvasSize.HOT, gl.COLD],
	(l, points, size, gl) => l.update({
		sketches: [points],
		uniforms: { size: [size.width, size.height] },
		drawSettings : {
			clearColor: [0, 0, 0, 1],
			clearBits: gl.COLOR_BUFFER_BIT,
			enable: [gl.BLEND],
			blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]
		}
	})
)


// ===== render =====

export const render = stream(
	[painter.COLD, scene.HOT],
	(painter, scene) => painter.compose(scene)
)
