import '../../../../shared-utils/css/fullscreen.css'
import { addToLoop, startLoop } from '../../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../../shared-utils/app/painterState'
import { createLines3DSketch } from '../../../../shared-utils/sketches/lines/lines'
import { createPoints3DSketch } from '../../../../shared-utils/sketches/points/points'
import { createMirrorScene } from '../../../../shared-utils/vr/mirror-scene'
import { initPerspectiveViewport } from '../../../../shared-utils/vr/perspectiveViewport'
import { Q } from './context'
import { anchor, p1, p2, p3, update } from './physics'

initPerspectiveViewport(Q, {
	moveSpeed: 10,
	fovy: Math.PI * 0.6,
	position: [0, 30, -30],
	rotationY: Math.PI,
})

const lines = createLines3DSketch(Q, 'lines', {
	lineWidth: 0.5,

	scalePerspective: true,
	projectionMat: Q.state.viewPort.camera.projectionMat,
	viewMat: Q.state.viewPort.camera.viewMat,

	color: [Math.random(), Math.random(), Math.random(), 1],

	dynamicForm: true,
})

const points = createPoints3DSketch(Q, 'points', {
	pointSize: 2,

	scalePerspective: true,
	projectionMat: Q.state.viewPort.camera.projectionMat,
	viewMat: Q.state.viewPort.camera.viewMat,

	color: [Math.random(), Math.random(), Math.random(), 1],

	dynamicForm: true,
})

const scene = createMirrorScene(Q, [lines.sketch, points.sketch])

addToLoop((tpf) => {
	Q.emit(baseEvents.FRAME)

	update(tpf)

	lines.update({ points: [anchor, p1.pos, p2.pos, p3.pos] })
	points.update({ positions: [p1.pos, p2.pos, p3.pos] })

	Q.painter.compose(scene.mirrorScene, scene.scene).show(scene.scene)
}, 'loop')

Q.listen('', baseEvents.RESIZE, () => lines.update())

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
