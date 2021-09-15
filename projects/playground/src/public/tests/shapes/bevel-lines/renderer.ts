import { lineFrag, lineVert } from './shaders'
import { lineToTriangleStripGeometry } from '../../../../shared-utils/geometry/lines'
import { strokePatch2 } from './state'
import { Q } from './context'

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

const linePoints = strokePatch2(1.9, 1.9, 20)

const data = lineToTriangleStripGeometry(linePoints, 0.05, { withUVs: true })
const form = Q.getForm('line').update(data)

const sketch = Q.getSketch('line').update({ form, shade })

// === scene ===

export const scene = Q.getLayer('scene').update({
	sketches: sketch,
	drawSettings: {
		clearColor: [1, 1, 1, 1],
		enable: [Q.gl.CULL_FACE],
		cullFace: Q.gl.BACK,
	},
	directRender: true,
})
