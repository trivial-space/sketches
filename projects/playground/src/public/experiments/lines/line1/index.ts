import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import {
	Line,
	LinePoint,
	startLine,
} from '../../../../shared-utils/geometry/lines_2d'
import { pointer } from 'tvs-libs/dist/events/pointer'
import {
	createLines2DSketch,
	Lines2DSketch,
} from '../../../../shared-utils/sketches/lines'

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

const scene = Q.getFrame('scene')

let lines: Line[] = []
let currentLine: Line | null = null

let lineSketches: Lines2DSketch[] = []

scene.update({
	layers: Q.getLayer('scene').update({
		sketches: lineSketches.map((s) => s.sketch),
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			enable: [Q.gl.CULL_FACE],
			cullFace: Q.gl.BACK,
		},
	}),
})

let dragging = false
pointer({ element: Q.gl.canvas as HTMLCanvasElement }, (val) => {
	if (val.dragging) {
		const point: LinePoint = { vertex: [val.drag.x, val.drag.y] }
		console.log('adding', point, 'to currentLine')

		if (!dragging) {
			dragging = true
			currentLine = startLine(point)
			lines.push(currentLine)
		} else {
			currentLine?.append(point)
		}

		lineSketches = lines.map((line, i) => {
			console.log(`generating line ${i}`, [...line])
			return createLines2DSketch(Q, `line${i}`, {
				color: [1, 1, 0, 1],
				lineWidth: 20,
				points: [...line].map((p) => p.vertex),
			})
		})

		// === scene ===

		scene.update({
			layers: Q.getLayer('scene').update({
				sketches: lineSketches.map((s) => s.sketch),
				drawSettings: {
					clearColor: [1, 1, 1, 1],
					enable: [Q.gl.CULL_FACE],
					cullFace: Q.gl.BACK,
				},
			}),
		})

		Q.painter.compose(scene).display(scene)
	} else if (!val.dragging && dragging) {
		dragging = false
	}
})

Q.state.device.sizeMultiplier = window.devicePixelRatio

Q.listen('index', events.RESIZE, () => {
	lineSketches.forEach((l) => l.update())
	scene.update()
	Q.painter.compose(scene).display(scene)
})

import.meta.hot?.accept()
