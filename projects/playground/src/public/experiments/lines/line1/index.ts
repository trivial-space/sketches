import { events, Q } from './context'
import {
	Line,
	LinePoint,
	startLine,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons, pointer } from 'tvs-libs/dist/events/pointer'
import { createLines2DSketch } from '../../../../shared-utils/sketches/lines'
import { makeClear } from '../../../../../../painter/dist/utils/context'

// Q.state.device.sizeMultiplier = window.devicePixelRatio

const scene = Q.getFrame('scene')

let currentLine: Line = startLine({ vertex: [0, 0] })

let currentLineSketch = createLines2DSketch(Q, 'current-line', {
	dynamicForm: true,
	color: [0.1, 0.1, 0, 1],
	lineWidth: 5,
})

scene.update({
	layers: Q.getLayer('scene').update({
		sketches: currentLineSketch.sketch,

		drawSettings: {
			clearColor: [0.8, 0.8, 1, 1],
			clearBits: makeClear(Q.gl, 'color'),
		},
	}),
})

let dragging = false
let startPoint: [number, number] = [0, 0]

pointer({ element: Q.gl.canvas as HTMLCanvasElement }, (val) => {
	if (val.dragging) {
		if (!dragging) {
			dragging = true
			startPoint = [
				val.pressed[Buttons.LEFT].clientX,
				val.pressed[Buttons.LEFT].clientY,
			]

			const point: LinePoint = {
				vertex: [startPoint[0], startPoint[1]],
			}

			currentLine = startLine(point)
		} else {
			const point: LinePoint = {
				vertex: [startPoint[0] - val.drag.x, startPoint[1] - val.drag.y],
			}
			currentLine?.append(point)

			currentLineSketch.update({
				points: [...currentLine!].map((p) => p.vertex),
			})

			scene.update({
				layers: Q.getLayer('scene').update({
					sketches: currentLineSketch.sketch,
				}),
			})

			Q.painter.compose(scene).display(scene)
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
	Q.painter.compose(scene).display(scene)
})

import.meta.hot?.accept()
