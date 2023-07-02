import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import init, {
	get_geom,
	get_light,
	get_mvp,
	get_normal_mat,
	setup,
	update,
} from '../crate/pkg/tvs_sketch_projection'
import { render, renderInit } from './render'
import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'

init().then(() => {
	setup()
	const geom = get_geom()
	console.log('wasm geometry', geom)
	const ball = wasmGeometryToFormData(geom)
	renderInit(ball)

	addToLoop((tpf) => {
		update(tpf)
		render(get_mvp(), get_normal_mat(), get_light())
	}, 'mainLoop')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
