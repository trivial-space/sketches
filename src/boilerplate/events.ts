import { keyboard } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize } from 'tvs-libs/dist/lib/events/dom'
import { painter, canvas } from './context'
import { once, repeat } from 'shared-utils/scheduler'
import { camera, lookSpeed, moveSpeed } from './camera'
import { updateRotFromMouse, updatePosFromKeys } from 'tvs-utils/lib/vr/camera'



windowSize(() => once(() => {
	painter.resize()
	camera.props.aspect = canvas.width / canvas.height
	camera.props.needsUpdatePerspective = true
}, 'resize'))


mouse({element: canvas, enableRightButton: true}, m => {
	updateRotFromMouse(camera, lookSpeed, m)
})


let keys
keyboard(ks => keys = ks)

repeat(tpf => {
	const speed = moveSpeed * tpf / 16
	updatePosFromKeys(camera, speed, keys)
}, 'updateKeys')
