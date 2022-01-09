import { events, Q } from './context'
import {
	createLine,
	newLinePoint,
	smouthenPoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons } from 'tvs-libs/dist/events/pointer'
import { createLines2DSketch } from '../../../../shared-utils/sketches/lines/lines'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { once } from '../../../../shared-utils/scheduler'
import { baseEvents } from '../../../../shared-utils/painterState'

Q.state.device.sizeMultiplier = window.devicePixelRatio

let currentLine1 = createLine().append(newLinePoint([0, 0]))
let currentLine2 = createLine().append(newLinePoint([0, 0]))

let currentLineSketch1 = createLines2DSketch(Q, 'current-line1', {
	dynamicForm: true,
	color: [0.1, 0.1, 0, 1],
	lineWidth: 5,
})

let currentLineSketch2 = createLines2DSketch(Q, 'current-line2', {
	dynamicForm: true,
	color: [1, 0.1, 0.1, 1],
	lineWidth: 5,
})

const scene = Q.getLayer('scene').update({
	sketches: [
		//
		currentLineSketch2.sketch,
		currentLineSketch1.sketch,
	],

	drawSettings: {
		clearColor: [0.8, 0.8, 1, 1],
		clearBits: makeClear(Q.gl, 'color'),
	},
	directRender: true,
})

let dragging = false
let startPoint: [number, number] = [0, 0]

Q.listen('', baseEvents.POINTER, (s) => {
	const val = s.device.pointer
	if (val.dragging) {
		const m = Q.state.device.sizeMultiplier
		if (!dragging) {
			dragging = true
			startPoint = [
				val.pressed[Buttons.LEFT].clientX * m,
				val.pressed[Buttons.LEFT].clientY * m,
			]

			const point = newLinePoint([startPoint[0], startPoint[1]])

			currentLine1 = createLine().append(point)
			currentLine2 = createLine().append({ ...point })
		} else {
			const point = newLinePoint([
				startPoint[0] - val.drag.x * m,
				startPoint[1] - val.drag.y * m,
			])
			currentLine1!.append(point, true)
			currentLine2!.append({ ...point }, true)

			smouthenPoint(currentLine1.last?.prev, { depth: 2 })

			once(() => {
				currentLineSketch1.update({
					points: [...currentLine1!].map((p) => p.vertex),
				})
				currentLineSketch2.update({
					points: [...currentLine2!].map((p) => p.vertex),
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

	currentLineSketch2.update({
		points: [...currentLine2!].map((p) => p.vertex),
	})
	currentLineSketch1.update({
		points: [...currentLine1!].map((p) => p.vertex),
	})
	Q.painter.compose(scene)
})

import.meta.hot?.accept()
