import { repeat } from '../../../../shared-utils/scheduler'
import { getPainterContext } from '../../../../shared-utils/painterState'
import { createPoints2DSketch } from '../../../../shared-utils/sketches/points'
import { times } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from '../../../../../../painter/dist/utils/context'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

const pointCount = 100

Q.painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
	clearBits: makeClear(Q.gl, 'color'),
})

repeat(() => {
	const points = createPoints2DSketch(Q, 'points', {
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
		dynamicForm: true,
		pointSize: 11,
		// drawSettings: {
		// 	clearColor: [0, 0, 0, 1],
		// 	clearBits: makeClear(Q.gl, 'color'),
		// },
	})

	Q.painter.draw(points.sketch)
}, 'loop')

import.meta.hot?.accept()
