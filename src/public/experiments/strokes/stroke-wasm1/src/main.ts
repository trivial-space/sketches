import { wasmGeometryToFormData } from '../../../../../shared-utils/wasm/utils'
import init, { get_geom } from '../crate/pkg/tvs_sketch_strokes1'
import { render } from './render'

init().then(() => {
	const ball = wasmGeometryToFormData(get_geom())
	render(ball)
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
