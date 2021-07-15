import { getPainterContext } from '../../../../shared-utils/painterState'
import { createPoints2DSketch } from '../../../../shared-utils/sketches/points'
import { times } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { addToLoop, startLoop } from '../../../../shared-utils/frameLoop'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

const pointCount = 100

const pointsDynamic = createPoints2DSketch(Q, 'points1', {
	pointSize: 10,
	dynamicForm: true,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: makeClear(Q.gl, 'color'),
	},
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

addToLoop(() => {
	pointsDynamic.update({
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

	Q.painter.draw(pointsDynamic.sketch)
	Q.painter.draw(pointsStatic.sketch)
}, 'loop')

startLoop()

import.meta.hot?.accept()
