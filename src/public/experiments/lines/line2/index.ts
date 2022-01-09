import { events, Q } from './context'
import {
	createLine,
	LinePoint,
	lineToFormCollection,
	newLinePoint,
	smouthenPoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons } from 'tvs-libs/dist/events/pointer'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Sketch } from 'tvs-painter/dist/sketch'
import { lineFrag, lineVert } from './shaders'
import { LinkedListOptions } from 'tvs-libs/dist/datastructures/double-linked-list'
import { baseEvents } from '../../../../shared-utils/painterState'
import { lerp } from 'tvs-libs/dist/math/core'
import { dot } from 'tvs-libs/dist/math/vectors'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const lineWidth = 40

const opts: LinkedListOptions<LinePoint> = {
	// onNextUpdated(n) {
	// 	const minWidth = Math.min((n.val.length || 1) * 2, lineWidth)
	// 	if (n.prev) {
	// 		const lerpDot = Math.max(0, dot(n.prev.val.direction, n.val.direction))
	// 		console.log(lerpDot)
	// 		n.val.width = lerp(
	// 			lerpDot * lerpDot * lerpDot * lerpDot,
	// 			minWidth,
	// 			lineWidth,
	// 		)
	// 		// n.val.width = minWidth
	// 		// n.val.width = lineWidth
	// 	} else {
	// 		n.val.width = minWidth
	// 	}
	// },
}

let currentLine = createLine(opts).append(newLinePoint([0, 0], lineWidth))

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

Q.listen('index', baseEvents.POINTER, (s) => {
	const p = s.device.pointer
	if (p.dragging) {
		const m = Q.state.device.sizeMultiplier
		if (!dragging) {
			dragging = true
			startPoint = [
				p.pressed[Buttons.LEFT].clientX * m,
				p.pressed[Buttons.LEFT].clientY * m,
			]

			const point = newLinePoint([startPoint[0], startPoint[1]], lineWidth)

			currentLine = createLine(opts).append(point)
		} else {
			const point = newLinePoint(
				[startPoint[0] - p.drag.x * m, startPoint[1] - p.drag.y * m],
				lineWidth,
			)
			currentLine?.append(point, true)
			smouthenPoint(currentLine.last?.prev, { depth: 2 })

			const formDatas = lineToFormCollection(currentLine, {
				lineWidth,
				storeType: 'DYNAMIC',
			})[0]

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
	} else if (!p.dragging && dragging) {
		dragging = false
	}
})

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
})
