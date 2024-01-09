import '../../../../../shared-utils/css/fullscreen.css'
import { addToLoop, startLoop } from '../../../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../../../shared-utils/app/painterState'
import { initCamera } from '../../../../../shared-utils/vr/wasmCamera'
import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'
import init, {
	get_frame_data,
	get_init_data,
	reset_camera,
	setup,
	update_camera,
	update_screen,
} from '../crate/pkg/tvs_sketch_ssao'
import { Q } from './context'
import { render, renderInit } from './render'

init().then(() => {
	setup()
	initCamera(Q, {
		updateScreen: update_screen,
		updateTransform: update_camera,
		resetCamera: reset_camera,
		moveSpeed: 1.5,
	})
	Q.emit(baseEvents.RESIZE)

	const initData = get_init_data()
	console.log('initData', initData)
	const frameData = get_frame_data()
	console.log('frameData', frameData)

	const groundForm = wasmGeometryToFormData(initData.ground_geom)
	const objectForm = wasmGeometryToFormData(initData.object_geom)

	renderInit(objectForm, groundForm)

	addToLoop(() => {
		// for camera
		Q.emit(baseEvents.FRAME)

		render({ ...get_frame_data(), ...initData })
	}, 'mainLoop')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
