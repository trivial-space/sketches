import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import init, {
	get_glass_geoms,
	get_ground_geom,
	get_light,
	get_mvp,
	get_normal_mat,
	get_cam_mat,
	setup,
	update,
	update_camera,
	update_screen,
} from '../crate/pkg/tvs_sketch_projection'
import { render, renderInit } from './render'
import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'
import { times } from 'tvs-libs/dist/utils/sequence'
import { Q } from './context'
import { baseEvents } from 'tvs-utils/dist/app/painterState'
import { initCamera } from '../../../../../shared-utils/vr/wasmCamera'

init().then(() => {
	setup()
	initCamera(Q, { updateScreen: update_screen, updateTransform: update_camera })
	Q.emit(baseEvents.RESIZE)

	const glassForms = get_glass_geoms().map((g: any) =>
		wasmGeometryToFormData(g),
	)
	const groundForm = wasmGeometryToFormData(get_ground_geom())

	renderInit(glassForms, groundForm)

	addToLoop((tpf) => {
		update(tpf)
		Q.emit(baseEvents.FRAME)
		const uniforms = times(
			(i) => ({
				camera: get_mvp(i),
				normalMatrix: get_normal_mat(i),
			}),
			glassForms.length,
		)
		render(uniforms, get_cam_mat(), get_light())
	}, 'mainLoop')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
