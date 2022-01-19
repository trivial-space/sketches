import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import { lineToTriangleStripGeometry } from '../../../../shared-utils/geometry/lines_3d'
import { strokePatch } from './state'

Q.state.time = 0
Q.state.device.sizeMultiplier = window.devicePixelRatio

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

const linePoints = strokePatch(1.9, 1.9, 20)

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

// === draw ===

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
	console.log(scene._targets[0].width, Q.gl.drawingBufferWidth)
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
