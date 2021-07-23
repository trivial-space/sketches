import { lineFrag, lineVert } from './shaders'
import { lineToTriangleStripGeometry } from '../../../../shared-utils/geometry/lines'
import { strokePatch } from './state'
import { Q } from './context'

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

const linePoints = strokePatch(1, 1, 1)

const data = lineToTriangleStripGeometry(linePoints, 0.05, { withUVs: true })
const form = Q.getForm('line').update(data)

const sketch = Q.getSketch('line').update({
	form: form,
	shade,
})

// === scene ===

export const scene = Q.getFrame('scene').update({
	layers: Q.getLayer('scene').update({
		sketches: [sketch],
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			// enable: [Q.gl.CULL_FACE],
			// cullFace: Q.gl.BACK,
		},
	}),
})
