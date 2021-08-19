import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import {
	Line,
	LinePoint,
	startLine,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons, pointer } from 'tvs-libs/dist/events/pointer'
import {
	createLines2DSketch,
	Lines2DSketch,
} from '../../../../shared-utils/sketches/lines'

// Q.state.device.sizeMultiplier = window.devicePixelRatio
const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

const scene = Q.getFrame('scene')

let lines: Line[] = []
let currentLine: Line | null = null

let currentLineSketch = createLines2DSketch(Q, 'current-line', {
	dynamicForm: true,
	color: [0.1, 0.1, 0, 1],
	lineWidth: 20,
})
let lineSketches: Lines2DSketch[] = [currentLineSketch]

scene.update({
	layers: Q.getLayer('scene').update({ sketches: [] }),
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
			console.log('adding', point, 'to currentLine')

			currentLine = startLine(point)
			lines.push(currentLine)
		} else {
			const point: LinePoint = {
				vertex: [startPoint[0] - val.drag.x, startPoint[1] - val.drag.y],
			}
			console.log('adding', point, 'to currentLine')
			currentLine?.append(point)

			// lineSketches = lines.map((line, i) => {
			// 	return createLines2DSketch(Q, `line${i}-${line.size}`, {
			// 		dynamicForm: true,
			// 		color: [1, 1, 0, 1],
			// 		lineWidth: 20,
			// 		points: [...line].map((p) => p.vertex),
			// 	})
			// })

			currentLineSketch.update({
				points: [...currentLine!].map((p) => p.vertex),
			})

			scene.update({
				layers: Q.getLayer('scene').update({
					sketches: lineSketches.map((s) => s.sketch),
					drawSettings: {
						clearColor: [0, 0, 1, 1],
					},
				}),
			})

			Q.painter.compose(scene).display(scene)
		}
	} else if (!val.dragging && dragging) {
		dragging = false
	}
})

Q.listen('index', events.RESIZE, () => {
	lineSketches.forEach((l) => l.update())
	scene.update()
	Q.painter.compose(scene).display(scene)
})

import.meta.hot?.accept()
