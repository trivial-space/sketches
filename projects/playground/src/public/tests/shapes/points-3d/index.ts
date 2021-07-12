import { repeat } from '../../../../shared-utils/scheduler'
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

const pointCount = 200

const pointsMat = mat4.fromTranslation(mat4.create(), [0, 0, -100])
const worldMat = mat4.create()

const points = createPoints3DSketch(Q, 'points', {
	pointSize: 5,
	scalePerspective: true,
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
	mat4.rotateY(pointsMat, pointsMat, 0.01)
	const view = mat4.mul(worldMat, Q.state.viewPort.camera.viewMat, pointsMat)

	points.update({
		projectionMat: Q.state.viewPort.camera.projectionMat,
		viewMat: view,
	})

	Q.state.device.tpf = tpf
	Q.emit(baseEvents.FRAME)

	Q.painter.draw(points.sketch)
}, 'loop')

startLoop()

import.meta.hot?.accept()
