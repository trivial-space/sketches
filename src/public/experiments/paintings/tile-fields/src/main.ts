import { makeClear } from 'tvs-painter/dist/utils/context'
import '../../../../../shared-utils/css/fullscreen.css'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import init, {
	get_animated_geom,
	setup,
} from '../crate/pkg/tvs_sketch_tile_fields'
import { Q } from './context'
import { lineShader, bgFrag, copyFrag } from './shader'
import { getNoiseTextureData } from 'tvs-utils/dist/graphics/texture-helpers'
import { shuffle } from 'tvs-libs/dist/utils/sequence'
import { adjustHue, hsl, hslToRGB } from 'tvs-libs/dist/graphics/colors'
import { normalRand01, normalRand11 } from 'tvs-libs/dist/math/random'
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

const backgroundLayer = Q.getLayer('background').update({
	effects: Q.getEffect('bg').update({
		frag: bgFrag,
		uniforms: { color: [0.5, 0.5, 0.5] },
	}),
})

Q.painter.compose(backgroundLayer)

const copyEffect = Q.getEffect('copy').update({
	frag: copyFrag,
})

backgroundLayer.update({
	effects: copyEffect,
	uniforms: {
		source: () => animationLayer.image(),
	},
})

init().then(() => {
	setup(7)

	const shade = Q.getShade('line').update(lineShader)

	let initialPaint = true

	function renderBackground() {
		const data: {
			color: { hue: number; lightness: number }
			geometries: WasmGeometry[][]
		}[] = get_geom()

		console.log(data)

		const tiles = shuffle(data).map(
			({ geometries, color: { hue, lightness } }, i) => {
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
				setTimeout(renderBackground, Math.random() * 4000)
				return
			}

			const bruchCount = initialPaint
				? tiles.length
				: Math.floor(Math.random() * 2) + 1
			const brushes = tiles.splice(0, bruchCount)

			initialPaint = false

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

				console.log('rendering finished lines', finishedLineSketches.length)
				if (finishedLineSketches.length > 0) {
					animationLayer.update({
						sketches: [copyEffect, ...finishedLineSketches],
						uniforms: {
							size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
							noiseTex: () => noiseTex.image(),
							source: () => backgroundLayer.image(),
						},
					})
					Q.painter.compose(animationLayer, backgroundLayer)
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

				console.log('rendering animation', animationSketches.length)
				if (animationSketches.length > 0) {
					animationLayer.update({
						sketches: [copyEffect, ...animationSketches],
						uniforms: {
							size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
							noiseTex: () => noiseTex.image(),
							source: () => backgroundLayer.image(),
						},
					})

					Q.painter.compose(animationLayer).show(animationLayer)
					requestAnimationFrame(render)
				} else {
					Q.painter.show(animationLayer)
					setTimeout(renderBruches, Math.random() * 4000)
				}
			}

			render()
		}

		renderBruches()
	}

	renderBackground()
})
