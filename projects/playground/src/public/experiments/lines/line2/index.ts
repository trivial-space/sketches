import { events, Q } from './context'
import {
	createLine,
	LinePoint,
	lineToTriangleStripGeometry,
	newLinePoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons } from 'tvs-libs/dist/events/pointer'
import { makeClear } from '../../../../../../painter/dist/utils/context'
import { Sketch } from 'tvs-painter/dist/sketch'
import { lineFrag, lineVert } from './shaders'
import { LinkedListOptions } from 'tvs-libs/dist/datastructures/double-linked-list'
import { baseEvents } from '../../../../shared-utils/painterState'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const lineWidth = 40

const opts: LinkedListOptions<LinePoint> = {
	onNextUpdated(n) {
		n.val.width = Math.min(n.val.length * 2, lineWidth)
	},
}

let currentLine = createLine(opts).append(newLinePoint([0, 0]))

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

			const point = newLinePoint([startPoint[0], startPoint[1]])

			currentLine = createLine(opts).append(point)
		} else {
			const point = newLinePoint([
				startPoint[0] - p.drag.x * m,
				startPoint[1] - p.drag.y * m,
			])
			currentLine?.append(point, true)

			const formDatas = lineToTriangleStripGeometry(
				currentLine,
				undefined,
				'DYNAMIC',
			)

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
