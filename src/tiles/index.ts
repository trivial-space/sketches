import { repeat } from 'shared-utils/scheduler'
import { update } from 'tvs-utils/dist/lib/vr/camera'
import { camera } from './camera'
import { painter } from './context'
import { scene } from './renderer'
import { updateActiveTiles } from './state/tiles'
import './events'


repeat(tpf => {
	update(camera)
	updateActiveTiles(tpf)
	painter.compose(scene)
}, 'render')


if (module.hot) {
	module.hot.accept()
}
