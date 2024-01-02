import { Q } from './context'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { bgFrag, copyFrag, lineShader } from './shader'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import { get_painting_animation } from '../crate/pkg/tvs_sketch_tile_fields'
import { shuffle } from 'tvs-libs/dist/utils/sequence'
import { adjustHue, hsl, hslToRGB } from 'tvs-libs/dist/graphics/colors'
import { normalRand01, normalRand11 } from 'tvs-libs/dist/math/random'
import { clamp } from 'tvs-libs/dist/math/core'
import { getNoiseTextureData } from '../../../../../shared-utils/graphics/texture-helpers'
import { onNextFrame } from '../../../../../shared-utils/app/frameLoop'

export interface WasmTileData {
	color: {
		hue: number
		lightness: number
	}
	line_geometries: WasmGeometry[][]
}

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

const copyEffect = Q.getEffect('copy').update({
	frag: copyFrag,
})

const bgInitEffect = Q.getEffect('bg').update({
	frag: bgFrag,
})

const shade = Q.getShade('line').update(lineShader)

function calculateColor(hue: number, lightness: number) {
	return hslToRGB(
		hsl(
			adjustHue(hue + normalRand01() * 0.1),
			Math.pow((Math.random() + Math.random()) / 2, 1.5),
			clamp(0, 1, lightness + normalRand11() * 0.4),
		),
	)
}

export function setupPainting(
	idx: number,
	width: number,
	height: number,
	initialTiles: WasmTileData[],
) {
	const paintingLayer = Q.getLayer('animation' + idx).update({
		width,
		height,
		bufferOptions: [{ type: 'UNSIGNED_BYTE' }],
		drawSettings: {
			enable: [Q.gl.CULL_FACE, Q.gl.BLEND],
			clearBits: makeClear(Q.gl, 'color'),
			cullFace: Q.gl.BACK,
			clearColor: [1, 1, 1, 1],
			blendEquationSeparate: [Q.gl.FUNC_ADD, Q.gl.MAX],
			blendFuncSeparate: [
				Q.gl.SRC_ALPHA,
				Q.gl.ONE_MINUS_SRC_ALPHA,
				Q.gl.ONE_MINUS_DST_ALPHA,
				Q.gl.ONE_MINUS_SRC_ALPHA,
			],
		},
	})

	const backgroundLayer = Q.getLayer('background' + idx).update({
		width,
		height,
		bufferOptions: [{ type: 'UNSIGNED_BYTE' }],
		effects: bgInitEffect,
		uniforms: {
			color: calculateColor(
				initialTiles[0].color.hue,
				initialTiles[0].color.lightness,
			),
		},
	})

	Q.painter.compose(backgroundLayer)

	backgroundLayer.update({
		effects: copyEffect,
		uniforms: {
			source: () => paintingLayer.image(),
		},
	})

	const initialSketches = shuffle(initialTiles).flatMap((t, j) => {
		const color = calculateColor(t.color.hue, t.color.lightness)
		return t.line_geometries[0].map((data, i) => {
			return Q.getSketch('line_init' + idx + '_' + i + '_' + j).update({
				form: Q.getForm('line_init' + idx + '_' + i + '_' + j).update(
					wasmGeometryToFormData(data, 'DYNAMIC'),
				),
				shade,
				uniforms: { color },
			})
		})
	})

	paintingLayer.update({
		sketches: [copyEffect, ...initialSketches],
		uniforms: {
			size: [width, height],
			noiseTex: () => noiseTex.image(),
			source: () => backgroundLayer.image(),
		},
	})

	Q.painter.compose(paintingLayer, backgroundLayer)

	function renderLayer() {
		const data: WasmTileData[] = get_painting_animation(idx)

		const tiles = shuffle(data).map(
			({ line_geometries: geometries, color: { hue, lightness } }, i) => {
				const color = calculateColor(hue, lightness)

				return { color, geometries, currentLine: 0, currentFrame: 0, id: i }
			},
		)

		function renderBruches() {
			if (!tiles.length) {
				setTimeout(renderLayer, Math.random() * 4000)
				return
			}

			const brush = tiles.pop()!

			function render() {
				const geom = brush.geometries[brush.currentLine]?.[brush.currentFrame]

				if (!geom) {
					setTimeout(renderBruches, Math.random() * 5000)
					return
				}

				const sketch = Q.getSketch('line' + idx).update({
					form: Q.getForm('line' + idx).update(
						wasmGeometryToFormData(geom, 'DYNAMIC'),
					),
					shade,
					uniforms: {
						color: brush.color,
					},
				})

				paintingLayer.update({
					sketches: [copyEffect, sketch],
					uniforms: {
						size: [width, height],
						noiseTex: () => noiseTex.image(),
						source: () => backgroundLayer.image(),
					},
				})

				const finished =
					brush.geometries[brush.currentLine].length - 1 === brush.currentFrame

				if (finished) {
					brush.currentFrame = 0
					brush.currentLine++

					Q.painter.compose(paintingLayer, backgroundLayer)
				} else {
					brush.currentFrame++

					Q.painter.compose(paintingLayer)
				}

				onNextFrame(render, 'p' + idx)
			}

			render()
		}

		renderBruches()
	}

	setTimeout(renderLayer, Math.random() * 5000 + 100)

	return paintingLayer
}
