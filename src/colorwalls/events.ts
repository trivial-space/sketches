import { keyboard, Keys } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize } from 'tvs-libs/dist/lib/events/dom'
import { painter, canvas } from './context'
import { once } from 'shared-utils/scheduler'
import { camera, lookSpeed, moveSpeed } from './camera'



windowSize(() => once(() => {
	painter.resize()
	camera.props.aspect = canvas.width / canvas.height
	camera.props.needsUpdatePerspective = true
}, 'resize'))


let oX = 0, oY = 0
mouse({element: canvas, enableRightButton: true}, m => {
	const deltaX = m.drag.x === 0 ? m.drag.x : oX - m.drag.x
	const deltaY = m.drag.y === 0 ? m.drag.y : oY - m.drag.y
	oX = m.drag.x
	oY = m.drag.y
	camera.props.rotateX = deltaY * lookSpeed
	camera.props.rotateY = deltaX * lookSpeed
})


keyboard(keys => {
	if (!keys) return
	if (keys[Keys.UP] || keys[Keys.W]) {
		camera.props.moveForward = moveSpeed
	}
	if (keys[Keys.DOWN] || keys[Keys.S]) {
		camera.props.moveForward = -moveSpeed
	}
	if (keys[Keys.LEFT] || keys[Keys.A]) {
		camera.props.moveLeft = moveSpeed
	}
	if (keys[Keys.RIGHT] || keys[Keys.D]) {
		camera.props.moveLeft = -moveSpeed
	}
})
