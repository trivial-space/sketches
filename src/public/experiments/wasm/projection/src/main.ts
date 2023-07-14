import { addToLoop, startLoop } from 'tvs-utils/dist/app/frameLoop'
import init, {
	get_geom,
	get_light,
	get_mvp,
	get_normal_mat,
	setup,
	update,
	update_screen,
} from '../crate/pkg/tvs_sketch_projection'
import { render, renderInit } from './render'
import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'
import { FormData } from 'tvs-painter'
import { times } from 'tvs-libs/dist/utils/sequence'
import { Q } from './context'
import { baseEvents } from 'tvs-utils/dist/app/painterState'

init().then(() => {
	setup()
	const geometries = get_geom()
	console.log('wasm geometries', geometries)
	const forms: FormData[] = geometries.map((g: any) =>
		wasmGeometryToFormData(g),
	)
	renderInit(forms)

	Q.listen('resize', baseEvents.RESIZE, (s) => {
		update_screen(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight)
	})
	Q.emit(baseEvents.RESIZE)

	addToLoop((tpf) => {
		update(tpf)
		const uniforms = times(
			(i) => ({
				camera: get_mvp(i),
				normalMatrix: get_normal_mat(i),
			}),
			forms.length,
		)
		render(uniforms, get_light())
	}, 'mainLoop')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
