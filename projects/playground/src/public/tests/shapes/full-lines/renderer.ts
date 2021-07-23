import { Q, events } from './context'
import { flatMap, times, flatten } from 'tvs-libs/dist/utils/sequence'
import { initPerspectiveViewport } from '../../../../shared-utils/vr/perspectiveViewport'
import { lineFrag, lineVert } from './shaders'
import { mat4 } from 'gl-matrix'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { lineToTriangleStripGeometry } from '../../../../shared-utils/geometry/lines'

const { gl, state: s } = Q

initPerspectiveViewport(Q, {
	position: [0, 10, 30],
})

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

// === line1 ===

const form1 = Q.getForm('line1')
const transform1 = mat4.create()

const sketch1 = Q.getSketch('line1').update({
	form: form1,
	shade,
	uniforms: {
		transform: transform1,
	},
})

// === line2 ===

const form2 = Q.getForm('line2')
const transform2 = mat4.fromTranslation(mat4.create(), [10, 0, 0])

const sketch2 = Q.getSketch('line2').update({
	form: form2,
	shade,
	uniforms: {
		transform: transform2,
	},
})

// === scene ===

const normalMat = mat4.create()
export const scene = Q.getFrame('scene').update({
	layers: Q.getLayer('scene').update({
		sketches: [sketch1, sketch2],
		uniforms: {
			view: () => s.viewPort.camera.viewMat,
			projection: () => s.viewPort.camera.projectionMat,
			normalMatrix: () =>
				mat4.transpose(
					normalMat,
					mat4.invert(normalMat, s.viewPort.camera.viewMat),
				),
		},
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			clearBits: makeClear(gl, 'depth', 'color'),
			cullFace: gl.FRONT,
			enable: [gl.DEPTH_TEST],
		},
	}),
})

Q.listen('renderer', events.FRAME, (s) => {
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
			uv: {
				buffer: new Float32Array(
					flatten(
						times(
							(i) => [i / s.lines.line1.length, i / s.lines.line1.length],
							s.lines.line1.length,
						),
					),
				),
				storeType: 'DYNAMIC',
			},
		},
		drawType: 'LINE_STRIP',
		itemCount: s.lines.line1.length,
	})

	form2.update(
		lineToTriangleStripGeometry(s.lines.line1, 0.4, {
			withBackFace: true,
			withNormals: true,
			withUVs: true,
			storeType: 'DYNAMIC',
		}),
	)
})
