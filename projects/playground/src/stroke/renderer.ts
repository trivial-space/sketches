import {
	getForm,
	getShade,
	getSketch,
	getFrame,
	getLayer,
} from '../shared-utils/painterState'
import { painter, state } from './context'
import { lineFrag, lineVert } from './shaders'
import { mat4 } from 'gl-matrix'
import { lineToTriangleStripGeometry } from '../shared-utils/geometry/lines'
import { line, strokePatch } from './state'
import { flatten } from 'tvs-libs/dist/utils/sequence'
import { clamp } from 'tvs-libs/dist/math/core'
import { getNoiseTextureData } from '../shared-utils/texture-helpers'

const shade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

// const linePoints = line([-0.5, 0], [0.5, 0], 30)
const linePoints = strokePatch(1, 1, 5)

const data = lineToTriangleStripGeometry(
	linePoints,
	(seg) =>
		20 * clamp(0.001, 0.0028, 1 / (30 * 30) / Math.pow(seg.length, 0.29)),
	// (seg) => 0.025,
	{ withUVs: true },
)
const form = getForm(painter, 'line').update(data)

export const noiseTexFrame = getFrame(painter, 'noiseTex').update({
	texture: getNoiseTextureData({
		width: 256,
		height: 256,
		startX: 3,
		startY: 3,
		data: {
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
			wrap: 'REPEAT',
		},
	}),
})

const sketch = getSketch(painter, 'line').update({
	form: form,
	shade,
	uniforms: {
		noiseTex: noiseTexFrame.image(),
	},
})

// === scene ===

export const scene = getFrame(painter, 'scene').update({
	layers: getLayer(painter, 'scene').update({
		sketches: [sketch],
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			enable: [painter.gl.BLEND],
		},
	}),
})
