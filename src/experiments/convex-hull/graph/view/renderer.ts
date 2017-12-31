import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { painter, gl, canvasSize } from './context'
import * as geometries from './geometries'
import * as shaders from './shaders'
import { makeShadeEntity, makeFormEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import { makeEffectLayerEntity } from 'tvs-utils/lib/vr/flow-painter-utils'
import { tripleStream } from '../state/nodes'
import { DrawSettings } from 'tvs-painter/lib'


export const drawSettings = stream(
	[gl.HOT],
	gl => ({
		enable: [gl.BLEND, gl.DEPTH_TEST],
		blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]
	} as DrawSettings)
)

painter.react(
	[drawSettings.HOT],
	(p, settings) => p.updateDrawSettings(settings)
)


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
			clearBits: gl.COLOR_BUFFER_BIT
		}
	})
)


export const sides = makeEffectLayerEntity(painter)
.react(
	[tripleStream.HOT, canvasSize.HOT, shaders.sides.HOT],
	(l, triple, size, frag) => l.update({
		frag,
		uniforms: {
			size: [size.width, size.height],
			p1: triple[0],
			p2: triple[1],
			p3: triple[2]
		}
	})
)

// ===== render =====

export const renderPoints = stream(
	[painter.COLD, scene.HOT],
	(painter, scene) => painter.compose(scene)
)

export const renderSides = stream(
	[painter.COLD, sides.HOT, scene.COLD],
	(painter, sides, scene) => painter.compose(scene, sides)
)
