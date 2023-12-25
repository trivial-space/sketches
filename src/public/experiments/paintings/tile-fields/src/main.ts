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
import { normalRand01 } from 'tvs-libs/dist/math/random'
import { clamp } from 'tvs-libs/dist/math/core'

Q.state.device.sizeMultiplier = window.devicePixelRatio

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

const animationLayer = Q.getLayer('animation').update({
	drawSettings: {
		enable: [Q.gl.CULL_FACE, Q.gl.BLEND],
		clearBits: makeClear(Q.gl, 'color'),
		cullFace: Q.gl.BACK,
		clearColor: [1, 1, 1, 0],
		// blendFuncSeparate: [
		// 	Q.gl.SRC_ALPHA,
		// 	Q.gl.ONE_MINUS_SRC_ALPHA,
		// 	Q.gl.ONE_MINUS_DST_ALPHA,
		// 	Q.gl.ONE_MINUS_SRC_ALPHA,
		// ],
	},
})

const backgroundLayer = Q.getLayer('background').update({})

const renderLayer = Q.getLayer('render').update({})

init().then(() => {
	setup(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight, 7)

	const shade = Q.getShade('line').update(lineShader)

	function renderBackground() {
		const data: {
			color: { hue: number; lightness: number }
			geometries: WasmGeometry[][]
		}[] = get_geom()

		console.log(data)

		const tiles = shuffle(data).map(
			({ geometries, color: { hue, lightness } }) => {
				const color = hslToRGB(
					hsl(
						hue,
						normalRand01() * Math.random(),
						clamp(0, 1, lightness + Math.random() * 0.8 - 0.4),
					),
				)

				return { color, geometries }
			},
		)

		let renderingTiles = data.length
		let k = 0

		function render() {
			if (renderingTiles <= 0) {
				return
			}

			const sketches = tiles.flatMap(({ geometries, color }, i) => {
				let g = geometries[k]
				if (!g) {
					if (k === geometries.length) {
						renderingTiles--
					}
					g = geometries[geometries.length - 1]
				}

				return g.map((geom, j) =>
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
			})

			animationLayer.update({
				sketches,
				uniforms: {
					size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
					noiseTex: () => noiseTex.image(),
				},
			})

			Q.painter.compose(animationLayer).show(animationLayer)

			k++
			console.log(k, renderingTiles)
			requestAnimationFrame(render)
		}

		render()
	}

	renderBackground()
})
