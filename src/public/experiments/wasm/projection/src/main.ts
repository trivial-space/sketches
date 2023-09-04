import '../../../../../shared-utils/css/fullscreen.css'
import init, {
	get_angle,
	get_frame_data,
	get_init_data,
	setup,
	update,
	update_camera,
	update_screen,
} from '../crate/pkg/tvs_sketch_projection'
import { render, renderInit } from './render'
import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'
import { Q } from './context'
import { baseEvents } from 'tvs-utils/dist/app/painterState'
import { initCamera } from '../../../../../shared-utils/vr/wasmCamera'
import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'

init().then(() => {
	setup()
	initCamera(Q, { updateScreen: update_screen, updateTransform: update_camera })
	Q.emit(baseEvents.RESIZE)

	const initData = get_init_data()
	console.log('initData', initData)
	const frameData = get_frame_data()
	console.log('frameData', frameData)

	const glassForms = initData.glass_geoms.map((g: any) =>
		wasmGeometryToFormData(g),
	)
	const groundForm = wasmGeometryToFormData(initData.ground_geom)

	renderInit(glassForms, groundForm, initData.ground)

	addToLoop((tpf) => {
		update(tpf)
		Q.emit(baseEvents.FRAME)

		const frameData = get_frame_data()
		// console.log(get_angle())
		// console.log('frameData', frameData)
		render(frameData)
	}, 'mainLoop')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
