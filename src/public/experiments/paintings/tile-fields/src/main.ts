import '../../../../../shared-utils/css/fullscreen.css'
import init, { setup } from '../crate/pkg/tvs_sketch_tile_fields'
import { Q } from './context'

Q.state.device.sizeMultiplier = window.devicePixelRatio

init().then(() => {
	setup(7)
})
