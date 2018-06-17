import { windowSize } from 'tvs-libs/dist/lib/events/dom'
import { painter, canvas } from './context'
import { once } from 'shared-utils/scheduler'
import { camera } from './camera'


export const canvasSize = [canvas.width, canvas.height]

windowSize(() => once(() => {
	painter.resize()
	camera.props.aspect = canvas.width / canvas.height
	camera.props.needsUpdatePerspective = true
	canvasSize[0] = canvas.width
	canvasSize[1] = canvas.height
}, 'resize'))
