import { lineToFormCollection } from '../../../../shared-utils/geometry/lines_2d'
import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import { strokePatch, strokePatch2 } from './state'

Q.state.time = 0
Q.state.device.sizeMultiplier = window.devicePixelRatio

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

// const linePoints = strokePatch2(20)
const linePoints = strokePatch(1.5, 1.5, 20)

const data = lineToFormCollection(linePoints, {
	lineWidth: 0.05,
	smouthCount: 4,
})

// let t = performance.now() / 1000
// for (let i = 0; i < 1000; i++) {
// 	const linePoints = strokePatch(1.5, 1.5, 20)
// 	lineToFormCollection(linePoints, {
// 		lineWidth: 0.05,
// 		smouthCount: 4,
// 	})
// }
// console.log('1000 lines: ', performance.now() / 1000 - t)

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

// if (import.meta.hot) {
// 	import.meta.hot.accept()
// }
