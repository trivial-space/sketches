import { repeat } from '../../../../shared-utils/scheduler'
import { getPainterContext } from '../../../../shared-utils/painterState'
import { createPoints2DSketch } from '../../../../shared-utils/sketches/points'
import { times } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from '../../../../../../painter/dist/utils/context'
import { createLines2DSketch } from '../../../../shared-utils/sketches/lines'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

const pointCount = 30

const pointsDynamic = createLines2DSketch(Q, 'lines1', {
	lineWidth: 4,
	dynamicForm: true,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: makeClear(Q.gl, 'color'),
	},
})

const pointsStatic = createLines2DSketch(Q, 'lines2', {
	lineWidth: 6,
	points: times(
		() => [
			Math.random() * Q.gl.drawingBufferWidth,
			Math.random() * Q.gl.drawingBufferHeight,
		],
		20,
	),
	color: [1, 1, 0, 1],
})

repeat(() => {
	pointsDynamic.update({
		points: times(
			() => [
				Math.random() * Q.gl.drawingBufferWidth,
				Math.random() * Q.gl.drawingBufferHeight,
			],
			pointCount,
		),
		colors: times(
			() => [Math.random(), Math.random(), Math.random(), 1],
			pointCount,
		),
	})

	Q.painter.draw(pointsDynamic.sketch)
	Q.painter.draw(pointsStatic.sketch)
}, 'loop')

import.meta.hot?.accept()
