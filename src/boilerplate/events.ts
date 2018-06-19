import { keyboardObserver } from 'tvs-libs/dist/lib/events/keyboard'
import { mouseObserver } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize } from 'tvs-libs/dist/lib/events/dom'
import { painter, canvas } from './context'
import { once } from 'shared-utils/scheduler'
import { camera } from './camera'



windowSize(() => once(() => {
	painter.resize()
	camera.props.aspect = canvas.width / canvas.height
	camera.props.needsUpdatePerspective = true
}, 'resize'))


export const mouse = mouseObserver({element: canvas, enableRightButton: true})

export const keyboard = keyboardObserver()
