import { mat4 } from 'gl-matrix'
import { defined } from 'tvs-libs/dist/types'
import { times } from 'tvs-libs/dist/utils/sequence'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { addToLoop, startLoop } from '../../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../../shared-utils/app/painterState'
import { createLines3DSketch } from '../../../../shared-utils/sketches/lines/lines'
import { initPerspectiveViewport } from '../../../../shared-utils/vr/perspectiveViewport'
import { Q } from './context'

initPerspectiveViewport(Q, {
	moveSpeed: 40,
	fovy: Math.PI * 0.6,
})

const pointsMat = mat4.fromTranslation(mat4.create(), [0, 0, -100])
const viewMat = mat4.create()

const pointsCount = 30
const lines = createLines3DSketch(Q, 'lines', {
	lineWidth: 3,

	scalePerspective: true,
	projectionMat: Q.state.viewPort.camera.projectionMat,
	viewMat: viewMat,

	points: times(
		() => [
			Math.random() * 100 - 50,
			Math.random() * 100 - 50,
			Math.random() * 100 - 50,
		],
		pointsCount,
	),
	colors: times(
		() => [Math.random(), Math.random(), Math.random(), 1],
		pointsCount,
	),

	drawSettings: {
		enable: [Q.gl.DEPTH_TEST],
		clearColor: [1, 0, 1, 1],
		clearBits: makeClear(Q.gl, 'depth', 'color'),
	},

	withPoints: true,
})

addToLoop(() => {
	Q.emit(baseEvents.FRAME)

	mat4.rotateY(pointsMat, pointsMat, 0.01)
	mat4.mul(viewMat, Q.state.viewPort.camera.viewMat, pointsMat)

	Q.painter.draw({
		sketches: [lines.sketch, lines.pointsSketch].filter(defined),
	})
}, 'loop')

Q.listen('', baseEvents.RESIZE, () => lines.update())

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
