import { repeat } from 'shared-utils/scheduler'
import { update } from 'tvs-utils/dist/lib/vr/camera'
import { camera } from 'colorwalls/camera'
import { painter } from 'colorwalls/context'
import { scene } from 'colorwalls/renderer'
import './events'


repeat(() => {
	update(camera)
	painter.compose(scene)
}, 'render')


if (module.hot) {
	module.hot.accept()
}
