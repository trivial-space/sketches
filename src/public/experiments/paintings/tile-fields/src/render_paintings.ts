import { Q } from './context'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { bgFrag, copyFrag, lineShader } from './shader'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import { get_animated_geom } from '../crate/pkg/tvs_sketch_tile_fields'
import { shuffle } from 'tvs-libs/dist/utils/sequence'
import { adjustHue, hsl, hslToRGB } from 'tvs-libs/dist/graphics/colors'
import { normalRand01, normalRand11 } from 'tvs-libs/dist/math/random'
import { clamp } from 'tvs-libs/dist/math/core'
import { getNoiseTextureData } from '../../../../../shared-utils/graphics/texture-helpers'
import { onNextFrame } from '../../../../../shared-utils/app/frameLoop'

interface WasmTileData {
	color: {
		hue: number
		lightness: number
	}
	tile_geometries: WasmGeometry[][]
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

const shade = Q.getShade('line').update(lineShader)

export function setupPainting(
	idx: number,
	width: number,
	height: number,
	initialTiles: WasmTileData[],
) {
	const paintingLayer = Q.getLayer('animation' + idx).update({
		width,
		height,
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
		effects: Q.getEffect('bg').update({
			frag: bgFrag,
			uniforms: { color: [0.5, 0.5, 0.5] },
		}),
	})

	Q.painter.compose(backgroundLayer)

	backgroundLayer.update({
		effects: copyEffect,
		uniforms: {
			source: () => paintingLayer.image(),
		},
	})

	const initialSketches = shuffle(initialTiles).flatMap((t) => {
		return t.tile_geometries[0].map((data, i) => {
			return Q.getSketch('line' + idx + '_' + i).update({
				form: Q.getForm('line' + idx + '_' + i).update(
					wasmGeometryToFormData(data, 'DYNAMIC'),
				),
				shade,
				uniforms: {
					color: t.color,
				},
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
		const data: WasmTileData[] = get_animated_geom(idx)

		const tiles = shuffle(data).map(
			({ tile_geometries: geometries, color: { hue, lightness } }, i) => {
				const color = hslToRGB(
					hsl(
						adjustHue(hue + normalRand01() * 0.1),
						Math.pow((Math.random() + Math.random()) / 2, 1.5),
						clamp(0, 1, lightness + normalRand11() * 0.4),
					),
				)

				return { color, geometries, currentLine: 0, currentFrame: 0, id: i }
			},
		)

		function renderBruches() {
			if (!tiles.length) {
				setTimeout(renderLayer, Math.random() * 4000)
				return
			}

			const bruchCount = Math.floor(Math.random() * 2) + 1
			const brushes = tiles.splice(0, bruchCount)

			function render() {
				const finishedLineSketches = brushes
					.filter((t) => {
						const l = t.geometries[t.currentLine]
						return l && t.currentFrame === l.length - 1
					})
					.map((t) => {
						const geom = t.geometries[t.currentLine][t.currentFrame]

						t.currentFrame = 0
						t.currentLine++

						return Q.getSketch('line' + t.id).update({
							form: Q.getForm('line' + t.id).update(
								wasmGeometryToFormData(geom, 'DYNAMIC'),
							),
							shade,
							uniforms: {
								color: t.color,
							},
						})
					})

				if (finishedLineSketches.length > 0) {
					paintingLayer.update({
						sketches: [copyEffect, ...finishedLineSketches],
						uniforms: {
							size: [width, height],
							noiseTex: () => noiseTex.image(),
							source: () => backgroundLayer.image(),
						},
					})
					Q.painter.compose(paintingLayer, backgroundLayer)
				}

				const animationSketches = brushes
					.filter((t) => t.geometries[t.currentLine])
					.map((t) => {
						const geom = t.geometries[t.currentLine][t.currentFrame]

						t.currentFrame++

						return Q.getSketch('line' + t.id).update({
							form: Q.getForm('line' + t.id).update(
								wasmGeometryToFormData(geom, 'DYNAMIC'),
							),
							shade,
							uniforms: {
								color: t.color,
							},
						})
					})

				if (animationSketches.length > 0) {
					paintingLayer.update({
						sketches: [copyEffect, ...animationSketches],
						uniforms: {
							size: [width, height],
							noiseTex: () => noiseTex.image(),
							source: () => backgroundLayer.image(),
						},
					})

					Q.painter.compose(paintingLayer).show(paintingLayer)
					onNextFrame(render, 'p' + idx)
				} else {
					Q.painter.show(paintingLayer)
					setTimeout(renderBruches, Math.random() * 4000)
				}
			}

			render()
		}

		renderBruches()
	}

	renderLayer()

	return { animationLayer: paintingLayer, backgroundLayer }
}
