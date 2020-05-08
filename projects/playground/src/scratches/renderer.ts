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
import { line } from './state'
import { flatten } from 'tvs-libs/dist/utils/sequence'

const shade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

const linePoints = line([-0.5, 0], [0.5, 0], 30)

const form2 = getForm(painter, 'line2').update({
	attribs: {
		position: {
			buffer: new Float32Array(flatten(linePoints)),
		},
	},
	drawType: 'LINE_STRIP',
	itemCount: linePoints.length,
})

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
