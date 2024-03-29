import { lineToAnimatedFormCollection } from '../../../../shared-utils/geometry/lines_2d'
import { getNoiseTextureData } from '../../../../shared-utils/graphics/texture-helpers'
import {
	brushStrokeFrag,
	BrushStrokeUniforms,
	brushStrokeVert,
} from '../../../../shared-utils/sketches/brushStrokes/brushStrokeLineShader'
import { makeBrushStroke } from '../../../../shared-utils/sketches/brushStrokes/brushStrokes'
import { events, Q } from './context'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const shade = Q.getShade('line').update({
	vert: brushStrokeVert,
	frag: brushStrokeFrag,
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
		},
	}),
})

// === scene ===

const scene = Q.getLayer('scene').update({
	drawSettings: {
		clearBits: 0, //Q.gl.COLOR_BUFFER_BIT,
		clearColor: [1, 1, 1, 1],
		enable: [Q.gl.BLEND],
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.SRC_ALPHA,
			Q.gl.ONE,
		],
	},
})

Q.listen('index', events.RESIZE, () => {
	const screenWidth = Q.gl.drawingBufferWidth
	const screenHeight = Q.gl.drawingBufferHeight

	scene.update({
		uniforms: {
			noiseTex: noiseTex.image(),
			size: [screenWidth, screenHeight],
			color: [0.1, 0.5, 0.3],
			edgeSharpness: 5,
			texScale: [8, 0.1],
		} as BrushStrokeUniforms,
		sketches: [
			Q.getEffect('').update({
				frag: 'precision mediump float; void main(void) {gl_FragColor = vec4(1.0 );}',
			}),
		],
	})

	Q.painter.compose(scene).show(scene)

	const width = screenWidth * 0.8
	const height = screenHeight * 0.6
	const left = (screenWidth - width) / 2
	const top = (screenHeight - height) / 2

	const line = makeBrushStroke({
		width,
		height,
		left,
		top,
		steps: 4,
		curveHeight: 200,
		offsetX: left,
		offsetY: top / 4,
		strokePointCount: 30,
	})

	const data = lineToAnimatedFormCollection(line, {
		lineWidth: 50 * Q.state.device.sizeMultiplier,
		storeType: 'DYNAMIC',
		smouthCount: 0,
		splitAfterLength: 10,
	})

	let i = 0
	const max = data.length
	console.log(max)

	function render() {
		if (i < max) {
			const sketches = data[i]
				.map((d, i) => Q.getForm('form' + i).update(d))
				.map((form, i) =>
					Q.getSketch('line' + i).update({
						form,
						shade,
					}),
				)

			scene.update({ sketches })
			Q.painter.compose(scene).show(scene)

			i++
			requestAnimationFrame(render)
		}
	}

	render()
})
