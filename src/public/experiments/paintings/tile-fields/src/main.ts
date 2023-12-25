import { makeClear } from 'tvs-painter/dist/utils/context'
import '../../../../../shared-utils/css/fullscreen.css'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import init, { get_geom, setup } from '../crate/pkg/tvs_sketch_tile_fields'
import { Q } from './context'
import { lineShader } from './shader'
import { getNoiseTextureData } from 'tvs-utils/dist/graphics/texture-helpers'
import { shuffle } from 'tvs-libs/dist/utils/sequence'
import { hsl, hslToRGB } from 'tvs-libs/dist/graphics/colors'
import { normalRand01, normalRand11 } from 'tvs-libs/dist/math/random'
import { clamp } from 'tvs-libs/dist/math/core'

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

	setup(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight, 7)
	const data: {
		color: { hue: number; lightness: number }
		geometries: WasmGeometry[]
	}[] = get_geom()

	console.log('generating line geom in: ', performance.now() / 1000 - t)
	console.log('init', data)

	const shade = Q.getShade('line').update(lineShader)
	const sketches = shuffle(data).flatMap(
		({ geometries, color: { hue, lightness } }, i) => {
			const color = hslToRGB(
				hsl(hue, normalRand01(), clamp(0, 1, lightness + normalRand11() * 0.5)),
			)
			return geometries.map((geom, j) =>
				Q.getSketch('line' + i + '_' + j).update({
					form: Q.getForm('line' + i + '_' + j).update(
						wasmGeometryToFormData(geom, 'DYNAMIC'),
					),
					shade,
					uniforms: {
						color,
					},
				}),
			)
		},
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
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
