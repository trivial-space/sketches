import {
	getForm,
	getShade,
	getSketch,
	getFrame,
	getLayer,
	addSystem,
} from '../../shared-utils/painterState'
import { painter, state, State, events } from './context'
import {
	flatMap,
	flatten,
	times,
	reverse,
	repeat,
	concat,
} from 'tvs-libs/dist/utils/sequence'
import { initPerspectiveViewport } from '../../shared-utils/vr/perspectiveViewport'
import { lineFrag, lineVert } from './shaders'
import { mat4 } from 'gl-matrix'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { partial, pipe } from 'tvs-libs/dist/fp/core'
import { lineSegmentToPoints, LineSegment, Line } from './lines'
import { mul, Vec } from 'tvs-libs/dist/math/vectors'

initPerspectiveViewport({
	position: [0, 10, 30],
})

const shade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

// === line1 ===

const form1 = getForm(painter, 'line1')
const transform1 = mat4.create()

const sketch1 = getSketch(painter, 'line1').update({
	form: form1,
	shade,
	uniforms: {
		transform: transform1,
	},
})

// === line2 ===

const form2 = getForm(painter, 'line2')
const transform2 = mat4.fromTranslation(mat4.create(), [10, 0, 0])

const sketch2 = getSketch(painter, 'line2').update({
	form: form2,
	shade,
	uniforms: {
		transform: transform2,
	},
})

// === scene ===

const normalMat = mat4.create()
export const scene = getFrame(painter, 'scene').update({
	layers: getLayer(painter, 'scene').update({
		sketches: [sketch1, sketch2],
		uniforms: {
			view: () => state.viewPort.camera.viewMat,
			projection: () => state.viewPort.camera.projectionMat,
			normalMatrix: () =>
				mat4.transpose(
					normalMat,
					mat4.invert(normalMat, state.viewPort.camera.viewMat),
				),
		},
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			clearBits: makeClear(painter.gl, 'depth', 'color'),
			cullFace: painter.gl.BACK,
			enable: [painter.gl.DEPTH_TEST, painter.gl.CULL_FACE],
		},
	}),
})

addSystem<State>('renderer', (e, s) => {
	if (e === events.FRAME) {
		form1.update({
			attribs: {
				position: {
					buffer: new Float32Array(flatMap((seg) => seg.vertex, s.lines.line1)),
					storeType: 'DYNAMIC',
				},
				normal: {
					buffer: new Float32Array(flatMap((s) => s.normal, s.lines.line1)),
					storeType: 'DYNAMIC',
				},
			},
			drawType: 'LINE_STRIP',
			itemCount: s.lines.line1.length,
		})
		form2.update({
			attribs: {
				position: {
					buffer: new Float32Array(
						flatten(
							concat(
								flatMap(partial(lineSegmentToPoints, 0.4), s.lines.line1),
								flatMap(
									pipe(partial(lineSegmentToPoints, 0.4), reverse),
									s.lines.line1,
								).reverse(),
							),
						),
					),
					storeType: 'DYNAMIC',
				},
				normal: {
					buffer: new Float32Array(
						flatten(
							concat(
								flatMap((s) => [s.normal, s.normal], s.lines.line1),
								flatMap(
									(s) => repeat(2, mul(-1, s.normal)),
									s.lines.line1,
								).reverse(),
							),
						),
					),
					storeType: 'DYNAMIC',
				},
			},
			drawType: 'TRIANGLE_STRIP',
			itemCount: s.lines.line1.length * 4,
		})
	}
})
