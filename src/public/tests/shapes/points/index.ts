import { createPoints2DSketch } from '../../../../shared-utils/sketches/points/points'
import { times } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { addToLoop, startLoop } from 'tvs-utils/src/app/frameLoop'
import { getPainterContext } from 'tvs-utils/dist/app/painterState'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

const pointCount = 100

const pointsDynamic = createPoints2DSketch(Q, 'points1', {
	pointSize: 10,
	dynamicForm: true,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: makeClear(Q.gl, 'color'),
		cullFace: Q.gl.BACK,
		enable: [Q.gl.CULL_FACE],
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

	Q.painter.draw({ sketches: [pointsDynamic.sketch, pointsStatic.sketch] })
}, 'loop')

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
