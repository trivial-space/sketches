import {
	getForm,
	getShade,
	getSketch,
	getFrame,
	getLayer,
} from '../../shared-utils/painterState'
import { painter, state } from './context'
import { line1 } from './state'
import { flatMap, flatten } from 'tvs-libs/dist/utils/sequence'
import { initPerspectiveViewport } from '../../shared-utils/vr/perspectiveViewport'
import { lineFrag, lineVert } from './shaders'
import { mat4 } from 'gl-matrix'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { partial } from 'tvs-libs/dist/fp/core'
import { lineSegmentToPoints } from './lines'

initPerspectiveViewport({})

const shade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

// === line1 ===

const form1 = getForm(painter, 'line1').update({
	attribs: {
		position: {
			buffer: new Float32Array(flatMap(seg => seg.vertex, line1)),
		},
	},
	drawType: 'LINE_STRIP',
	itemCount: line1.length,
})

const transform1 = mat4.create()

const sketch1 = getSketch(painter, 'line1').update({
	form: form1,
	shade,
	uniforms: {
		transform: transform1,
	},
})

// === line2 ===

const form2 = getForm(painter, 'line2').update({
	attribs: {
		position: {
			buffer: new Float32Array(
				flatten(flatMap(partial(lineSegmentToPoints, 0.4), line1)),
			),
		},
	},
	drawType: 'TRIANGLE_STRIP',
	itemCount: line1.length * 2,
})

const transform2 = mat4.fromTranslation(mat4.create(), [10, 0, 0])

const sketch2 = getSketch(painter, 'line2').update({
	form: form2,
	shade,
	uniforms: {
		transform: transform2,
	},
})

// === scene ===

export const scene = getFrame(painter, 'scene').update({
	layers: getLayer(painter, 'scene').update({
		sketches: [sketch1, sketch2],
		uniforms: {
			view: () => state.viewPort.camera.viewMat,
			projection: () => state.viewPort.camera.projectionMat,
		},
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			clearBits: makeClear(painter.gl, 'depth', 'color'),
		},
	}),
})
