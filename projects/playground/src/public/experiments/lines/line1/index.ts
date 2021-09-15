import { events, Q } from './context'
import {
	Line,
	LinePoint,
	startLine,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons, pointer } from 'tvs-libs/dist/events/pointer'
import { createLines2DSketch } from '../../../../shared-utils/sketches/lines'
import { makeClear } from '../../../../../../painter/dist/utils/context'
import { once } from '../../../../shared-utils/scheduler'

Q.state.device.sizeMultiplier = window.devicePixelRatio

let currentLine: Line = startLine({ vertex: [0, 0] })

let currentLineSketch = createLines2DSketch(Q, 'current-line', {
	dynamicForm: true,
	color: [0.1, 0.1, 0, 1],
	lineWidth: 20,
})

const scene = Q.getLayer('scene').update({
	sketches: currentLineSketch.sketch,

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

			const point: LinePoint = {
				vertex: [startPoint[0], startPoint[1]],
			}

			currentLine = startLine(point)
		} else {
			const point: LinePoint = {
				vertex: [
					startPoint[0] - val.drag.x * m,
					startPoint[1] - val.drag.y * m,
				],
			}
			currentLine?.append(point)

			once(() => {
				currentLineSketch.update({
					points: [...currentLine!].map((p) => p.vertex),
				})

				scene.update({
					sketches: currentLineSketch.sketch,
				})

				Q.painter.compose(scene)
			}, 'update-and-paint')
		}
	} else if (!val.dragging && dragging) {
		dragging = false
	}
})

Q.listen('index', events.RESIZE, () => {
	scene.update()

	currentLineSketch.update({
		points: [...currentLine!].map((p) => p.vertex),
	})
	Q.painter.compose(scene)
})
