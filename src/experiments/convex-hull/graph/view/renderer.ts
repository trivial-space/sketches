import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { unequal } from 'tvs-libs/dist/lib/utils/predicates'
import { Layer, LayerData } from 'tvs-painter'
import { makeDrawingLayerEntity, makeFormEntity, makeShadeEntity, makeSketchEntity } from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import { makeEffectLayerEntity } from 'tvs-utils/lib/vr/flow-painter-utils'
import { tripleStream } from '../state/nodes'
import { canvasSize, gl, painter } from './context'
import * as geometries from './geometries'
import * as shaders from './shaders'


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
			enable: [gl.BLEND],
			blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA]
		}
	})
)


export const sides = makeEffectLayerEntity(painter)
.react(
	[tripleStream.HOT, canvasSize.HOT, shaders.sides.HOT],
	(l, triple, size, frag) => l.update({
		frag,
		uniforms: { //triples.map(triple => ({
			size: [size.width, size.height],
			p1: triple[0],
			p2: triple[1],
			p3: triple[2],
			source: null
		}//))
	})
)

export const outBuffer1 = makeEffectLayerEntity(painter)
export const outBuffer2 = makeEffectLayerEntity(painter)

const updateOutBuffer = (l: Layer, out: Layer, size: any, frag: string) => l.update({
	buffered: true,
	...size,
	frag,
	uniforms: {
		previous: out.texture(),
		current: null
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
	[points.HOT, sides.HOT, outBuffer1.HOT, outBuffer2.HOT],
	(...args) => args
)
.react(
	[tripleStream.HOT],
	self => {
		const [p, s, o1, o2] = self
		return [p, s, o2, o1]
	}
)

export const renderSides = stream(
	[painter.COLD, renderLayers.HOT],
	(painter, layers) => painter.compose(...layers)
)
