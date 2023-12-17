import { makeClear } from 'tvs-painter/dist/utils/context'
import '../../../../../shared-utils/css/fullscreen.css'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import init, { get_geom } from '../crate/pkg/tvs_sketch_strokes1'
import { Q } from './context'
import { shader } from './shader'

Q.painter.updateDrawSettings({
	enable: [Q.gl.CULL_FACE],
	clearBits: makeClear(Q.gl, 'color'),
	cullFace: Q.gl.BACK,
	clearColor: [1, 1, 1, 1],
})

init().then(() => {
	const geom: WasmGeometry[] = get_geom(
		Q.gl.drawingBufferWidth,
		Q.gl.drawingBufferHeight,
		6,
	)

	console.log('init', geom)
	const shade = Q.getShade('line').update(shader)
	const sketches = geom.map((line, i) =>
		Q.getSketch('line' + i).update({
			form: Q.getForm('line' + i).update(wasmGeometryToFormData(line)),
			shade,
		}),
	)

	Q.painter.draw({
		sketches,
		uniforms: {
			size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
		},
	})
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
