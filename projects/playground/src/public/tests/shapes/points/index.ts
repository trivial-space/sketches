import { repeat } from '../../../../shared-utils/scheduler'
import { getPainterContext } from '../../../../shared-utils/painterState'
import { createPoints2DSketch } from '../../../../shared-utils/sketches/points'
import { times } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from '../../../../../../painter/dist/utils/context'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

const pointCount = 100

const pointsDynamic = createPoints2DSketch(Q, 'points1', {
	pointSize: 10,
	dynamicForm: true,
})

const pointsStatic = createPoints2DSketch(Q, 'points2', {
	pointSize: 30,
	positions: times(
		() => [
			Math.random() * Q.gl.drawingBufferWidth,
			Math.random() * Q.gl.drawingBufferHeight,
		],
		20,
	),
	color: [1, 1, 0, 1],
})

repeat(() => {
	pointsDynamic.updatePoints({
		positions: times(
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

	Q.painter.draw(pointsStatic.sketch)
	Q.painter.draw(pointsDynamic.sketch)
}, 'loop')

import.meta.hot?.accept()
