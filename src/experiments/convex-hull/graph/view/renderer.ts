import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { painter, gl, canvasSize } from './context'
import * as geometries from './geometries'
import * as shaders from './shaders'
import { makeShadeEntity, makeFormEntity, makeSketchEntity, makeDrawingLayerEntity } from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import { makeEffectLayerEntity } from 'tvs-utils/lib/vr/flow-painter-utils'
import { tripleStream } from '../state/nodes'
import { DrawSettings, LayerData } from 'tvs-painter/lib'
import { unequal } from 'tvs-libs/dist/lib/utils/predicates'


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

export const points = makeDrawingLayerEntity(painter)
.react(
	[pointsSketch.HOT, canvasSize.HOT, gl.COLD],
	(l, points, size, gl) => l.update({
		sketches: [points],
		uniforms: { size: [size.width, size.height] },
		drawSettings: {
			clearColor: [0, 0, 0, 1],
			clearBits: gl.COLOR_BUFFER_BIT,
			enable: [gl.BLEND, gl.DEPTH_TEST],
			blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]
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

export const outBuffer1 = makeEffectLayerEntity(painter)
export const outBuffer2 = makeEffectLayerEntity(painter)

const updateOutBuffer = (l, out, size, frag, gl) => l.update({
	buffered: true,
	...size,
	frag,
	uniforms: {
		previous: out.texture(),
		current: null
	},
	magFilter: 'NEAREST',
	minFilter: 'NEAREST',
	wrap: 'CLAMP_TO_EDGE',
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: gl.COLOR_BUFFER_BIT
	}
} as LayerData)

outBuffer1.react(
	[outBuffer2.HOT, canvasSize.HOT, shaders.compose.HOT, gl.HOT],
	updateOutBuffer
)
.accept(unequal)

outBuffer2.react(
	[outBuffer1.HOT, canvasSize.HOT, shaders.compose.HOT, gl.HOT],
	updateOutBuffer
)
.accept(unequal)


// ===== render =====

export const renderLayers = stream(
	[sides.COLD, outBuffer1.HOT, points.HOT, outBuffer2.HOT],
	(...args) => args
)
.react(
	[tripleStream.HOT],
	self => {
		const [s, o1, p, o2] = self
		return [s, o2, p, o1]
	}
)

export const renderSides = stream(
	[painter.COLD, renderLayers.HOT],
	(painter, layers) => painter.compose(...layers)
)
