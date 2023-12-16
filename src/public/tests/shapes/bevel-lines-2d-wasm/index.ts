import { events, Q } from './context'
import init, { get_geom } from './crate/pkg/tvs_sketch_bevel_lines_2d'
import { wasmGeometryToFormData } from '../../../../shared-utils/wasm/utils'
import { shader } from './shaders'

Q.state.time = 0
Q.state.device.sizeMultiplier = window.devicePixelRatio

const shade = Q.getShade('line').update(shader)

init().then(() => {
	let t = performance.now() / 1000
	for (let i = 0; i < 1000; i++) {
		get_geom(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight, 20)
	}
	console.log('1000 lines: ', performance.now() / 1000 - t)

	// === scene ===

	const scene = Q.getLayer('scene').update({
		drawSettings: {
			clearColor: [1, 1, 1, 1],
			enable: [Q.gl.CULL_FACE],
			cullFace: Q.gl.BACK,
		},
		directRender: true,
	})
	const render = () => {
		const data: any[] = get_geom(
			Q.gl.drawingBufferWidth,
			Q.gl.drawingBufferHeight,
			20,
		)
		console.log('init', data)
		const forms = data.map((line, i) =>
			Q.getForm('line' + i).update(wasmGeometryToFormData(line)),
		)

		const sketches = forms.map((form, i) =>
			Q.getSketch('line' + i).update({ form, shade }),
		)
		scene.update({
			sketches,
			uniforms: { size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight] },
		})
		Q.painter.compose(scene)
	}

	Q.listen('index', events.RESIZE, render)
	render()
})
