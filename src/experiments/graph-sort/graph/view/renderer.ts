import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { painter, gl, canvasSize } from './context'
import * as geometries from './geometries'
import * as pointShader from './shaders/point'
import * as lineShader from './shaders/line'
import { makeShadeEntity, makeFormEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-libs/dist/lib/vr/flow-painter-utils'
import { LayerData } from 'tvs-painter/dist/lib'


// ===== shaders =====

export const pointsShade = makeShadeEntity(painter, pointShader.spec)

export const linesShade = makeShadeEntity(painter, lineShader.spec)


// ===== geometries =====

export const pointsForm = makeFormEntity(painter, geometries.points)

export const linesForm = makeFormEntity(painter, geometries.lines)


// ===== objects =====

export const pointsData = stream(
	[pointsForm.HOT, pointsShade.HOT],
	(form, shade) => ({
		form, shade
	})
)

export const linesData = stream(
	[linesForm.HOT, linesShade.HOT],
	(form, shade) => ({
		form, shade
	})
)

export const pointsSketch = makeSketchEntity(painter, pointsData)

export const linesSketch = makeSketchEntity(painter, linesData)


// ===== layers =====

export const sceneData = stream(
	[pointsSketch.HOT, linesSketch.HOT, canvasSize.HOT, gl.HOT],
	(points, lines, size, gl) => ({
		sketches: [lines, points],
		uniforms: { size: [size.width, size.height] },
		drawSettings : {
			clearColor: [0, 0, 0, 1],
			clearBits: gl.COLOR_BUFFER_BIT
		}
	} as LayerData)
)

export const scene = makeDrawingLayerEntity(painter, sceneData)


// ===== render =====

export const render = stream(
	[painter.COLD, scene.HOT],
	(painter, scene) => painter.compose(scene)
)
