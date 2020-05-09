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
import { line, scratchPatch } from './state'
import { flatten } from 'tvs-libs/dist/utils/sequence'
import { clamp } from 'tvs-libs/dist/math/core'

const shade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

// const linePoints = line([-0.5, 0], [0.5, 0], 30)
const linePoints = scratchPatch(1, 1, 5)

// const form2 = getForm(painter, 'line2').update({
// 	attribs: {
// 		position: {
// 			buffer: new Float32Array(flatten(linePoints)),
// 		},
// 	},
// 	drawType: 'LINE_STRIP',
// 	itemCount: linePoints.length,
// })
const data = lineToTriangleStripGeometry(
	linePoints,
	(seg) =>
		20 * clamp(0.001, 0.0028, 1 / (30 * 30) / Math.pow(seg.length, 0.29)),
	// (seg) => 0.025,
)
console.log(data, linePoints)
const form2 = getForm(painter, 'line2').update(data)

const sketch2 = getSketch(painter, 'line2').update({
	form: form2,
	shade,
	uniforms: {},
})

// === scene ===

export const scene = getFrame(painter, 'scene').update({
	layers: getLayer(painter, 'scene').update({
		sketches: [sketch2],
		drawSettings: {
			clearColor: [1, 1, 1, 1],
		},
	}),
})
