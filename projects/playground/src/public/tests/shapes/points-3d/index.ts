import { createPoints3DSketch } from '../../../../shared-utils/sketches/points'
import { times } from 'tvs-libs/dist/utils/sequence'
import { mat4 } from 'gl-matrix'
import { initPerspectiveViewport } from '../../../../shared-utils/vr/perspectiveViewport'
import { Q } from './context'
import { makeClear } from '../../../../../../painter/dist/utils/context'
import { addToLoop, startLoop } from '../../../../shared-utils/frameLoop'
import { baseEvents } from '../../../../shared-utils/painterState'

initPerspectiveViewport(Q, {
	moveSpeed: 40,
	fovy: Math.PI * 0.6,
})

const pointCount = 2000

const pointsMat = mat4.fromTranslation(mat4.create(), [0, 0, -100])
const viewMat = mat4.create()

const points = createPoints3DSketch(Q, 'points', {
	pointSize: 2.5,
	scalePerspective: true,
	projectionMat: Q.state.viewPort.camera.projectionMat,
	viewMat: viewMat,

	positions: times(
		() => [
			Math.random() * 100 - 50,
			Math.random() * 100 - 50,
			Math.random() * 100 - 50,
		],
		pointCount,
	),

	colors: times(
		() => [Math.random(), Math.random(), Math.random(), 1],
		pointCount,
	),

	drawSettings: {
		enable: [Q.gl.DEPTH_TEST],
		clearColor: [1, 0, 1, 1],
		clearBits: makeClear(Q.gl, 'depth', 'color'),
	},
})

addToLoop((tpf) => {
	// make camera work
	Q.state.device.tpf = tpf
	Q.emit(baseEvents.FRAME)

	mat4.rotateY(pointsMat, pointsMat, 0.01)
	mat4.mul(viewMat, Q.state.viewPort.camera.viewMat, pointsMat)

	Q.painter.draw(points.sketch)
}, 'loop')

Q.listen('', baseEvents.RESIZE, (s) => points.update())

startLoop()

import.meta.hot?.accept()
