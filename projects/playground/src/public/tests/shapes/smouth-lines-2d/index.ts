import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import { strokePatch, strokePatch2 } from './state'
import { lineToSmouthTriangleStripGeometry } from '../../../../shared-utils/geometry/lines_2d'

Q.state.time = 0
Q.state.device.sizeMultiplier = window.devicePixelRatio

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

// const linePoints = strokePatch2(20)
const linePoints = strokePatch(1.5, 1.5, 20)

const data = lineToSmouthTriangleStripGeometry(linePoints, { lineWidth: 0.05 })

const forms = data.map((line, i) => Q.getForm('line' + i).update(line))

const sketches = forms.map((form, i) =>
	Q.getSketch('line' + i).update({ form, shade }),
)

// === scene ===

export const scene = Q.getLayer('scene').update({
	sketches,
	drawSettings: {
		clearColor: [1, 1, 1, 1],
		enable: [Q.gl.CULL_FACE],
		cullFace: Q.gl.BACK,
	},
	directRender: true,
})

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
	console.log(scene._targets[0].width, Q.gl.drawingBufferWidth)
})

// import.meta.hot?.accept()
