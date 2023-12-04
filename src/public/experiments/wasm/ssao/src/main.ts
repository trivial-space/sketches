import '../../../../../shared-utils/css/fullscreen.css'
import init, {
	get_frame_data,
	get_init_data,
	setup,
	update_camera,
	update_screen,
} from '../crate/pkg/tvs_sketch_ssao'
import { render, renderInit } from './render'
import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'
import { Q } from './context'
import { baseEvents } from 'tvs-utils/dist/app/painterState'
import { initCamera } from '../../../../../shared-utils/vr/wasmCamera'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'

init().then(() => {
	setup()
	initCamera(Q, {
		updateScreen: update_screen,
		updateTransform: update_camera,
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
