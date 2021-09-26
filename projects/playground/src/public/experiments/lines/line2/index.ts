import { events, Q } from './context'
import {
	createLine,
	lineToTriangleStripGeometry,
	newLinePoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons, pointer } from 'tvs-libs/dist/events/pointer'
import { makeClear } from '../../../../../../painter/dist/utils/context'
import { Sketch } from 'tvs-painter/dist/sketch'
import { lineFrag, lineVert } from './shaders'

Q.state.device.sizeMultiplier = window.devicePixelRatio

let currentLine = createLine().append(newLinePoint([0, 0]))

let sketches: Sketch[] = []

const shade = Q.getShade('shade').update({
	frag: lineFrag,
	vert: lineVert,
})

const scene = Q.getLayer('scene').update({
	drawSettings: {
		clearColor: [0.8, 0.8, 1, 1],
		clearBits: makeClear(Q.gl, 'color'),
	},
	directRender: true,
})

let dragging = false
let startPoint: [number, number] = [0, 0]

pointer({ element: Q.gl.canvas as HTMLCanvasElement }, (val) => {
	if (val.dragging) {
		const m = Q.state.device.sizeMultiplier
		if (!dragging) {
			dragging = true
			startPoint = [
				val.pressed[Buttons.LEFT].clientX * m,
				val.pressed[Buttons.LEFT].clientY * m,
			]

			const point = newLinePoint([startPoint[0], startPoint[1]])

			currentLine = createLine().append(point)
		} else {
			const point = newLinePoint([
				startPoint[0] - val.drag.x * m,
				startPoint[1] - val.drag.y * m,
			])
			currentLine?.append(point, true)

			const formDatas = lineToTriangleStripGeometry(currentLine, 40, 'DYNAMIC')
			console.log(formDatas)

			sketches = formDatas
				.map((formData, i) => Q.getForm('line' + i).update(formData))
				.map((form, i) => Q.getSketch('sketch' + i).update({ form, shade }))

			scene.update({
				sketches,
				uniforms: {
					uSize: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
				},
			})

			Q.painter.compose(scene)
		}
	} else if (!val.dragging && dragging) {
		dragging = false
	}
})

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
})
