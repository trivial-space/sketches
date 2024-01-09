import { makeClear } from 'tvs-painter/dist/utils/context'
import '../../../../../shared-utils/css/fullscreen.css'
import { getNoiseTextureData } from '../../../../../shared-utils/graphics/texture-helpers'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import init, { get_geom } from '../crate/pkg/tvs_sketch_strokes1'
import { Q } from './context'
import { lineShader } from './shader'

Q.state.device.sizeMultiplier = window.devicePixelRatio

Q.painter.updateDrawSettings({
	enable: [Q.gl.CULL_FACE, Q.gl.BLEND],
	clearBits: makeClear(Q.gl, 'color'),
	cullFace: Q.gl.BACK,
	clearColor: [1, 1, 1, 1],
})

export const noiseTex = Q.getLayer('noiseTex').update({
	texture: getNoiseTextureData({
		width: 256,
		height: 256,
		startX: 3,
		startY: 3,
		data: {
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
			wrap: 'REPEAT',
			type: 'UNSIGNED_BYTE',
		},
	}),
})

init().then(() => {
	const t = performance.now() / 1000
	const geoms: WasmGeometry[][] = get_geom(
		Q.gl.drawingBufferWidth,
		Q.gl.drawingBufferHeight,
		5,
	)
	console.log('generating line geom in: ', performance.now() / 1000 - t)

	console.log('init', geoms)

	let i = 0

	function render() {
		const geom = geoms[i++]
		const shade = Q.getShade('line').update(lineShader)
		const sketches = geom.map((line, i) =>
			Q.getSketch('line' + i).update({
				form: Q.getForm('line' + i).update(
					wasmGeometryToFormData(line, 'DYNAMIC'),
				),
				shade,
			}),
		)

		Q.painter.draw({
			effects: Q.getEffect('bg').update({
				frag: 'precision mediump float; void main(void) {gl_FragColor = vec4(1.0);}',
			}),
		})

		Q.painter.updateDrawSettings({
			blendEquationSeparate: [Q.gl.FUNC_ADD, Q.gl.MAX],
			blendFuncSeparate: [
				Q.gl.SRC_ALPHA,
				Q.gl.ONE_MINUS_SRC_ALPHA,
				Q.gl.ONE,
				Q.gl.ONE,
			],
		})

		Q.painter.draw({
			sketches,
			uniforms: {
				size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
				noiseTex: () => noiseTex.image(),
			},
		})

		if (i < geoms.length) {
			requestAnimationFrame(render)
		}
	}

	render()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
