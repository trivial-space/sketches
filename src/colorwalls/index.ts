import { repeat } from 'shared-utils/scheduler'
import { update } from 'tvs-utils/dist/lib/vr/camera'
import { camera } from './camera'
import { painter } from './context'
import { scene } from './renderer'
import './events'


repeat(() => {
	update(camera)
	painter.compose(scene)
}, 'render')


if (module.hot) {
	module.hot.accept()
}
