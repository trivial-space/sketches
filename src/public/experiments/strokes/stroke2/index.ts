import { events, Q } from './context'
import { makeLine } from './state'
import { getNoiseTextureData } from 'tvs-utils/src/graphics/texture-helpers'
import {
	createLine,
	lineToFormCollection,
} from '../../../../shared-utils/geometry/lines_2d'
import { lineShader } from './shaders'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const shade = Q.getShade('line').update(lineShader)

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

export const scene = Q.getLayer('scene').update({
	drawSettings: {
		clearColor: [1, 1, 1, 1],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		enable: [
			Q.gl.BLEND,
			//
			Q.gl.CULL_FACE,
		],
		cullFace: Q.gl.BACK,
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.ZERO,
			Q.gl.ONE,
		],
	},
	directRender: true,
})

Q.listen('index', events.RESIZE, () => {
	scene.update({
		uniforms: {
			noiseTex: noiseTex.image(),
			size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
		},
	})
	render()
})

const line = makeLine(1.2, 0.6, 4)
const currentLine = createLine()
let next = line.first

function render() {
	if (next) {
		currentLine.append(next.val)
		// next = next.next
		// if (next) currentLine.append(next.val)
		const data = lineToFormCollection(currentLine, {
			lineWidth: 0.07,
			storeType: 'DYNAMIC',
			smouthCount: 2,
		})

		const sketches = data
			.map((d, i) => Q.getForm('form' + i).update(d))
			.map((form, i) =>
				Q.getSketch('line' + i).update({
					form,
					shade,
				}),
			)

		scene.update({ sketches })
		Q.painter.compose(scene)

		next = next && next.next
		requestAnimationFrame(render)
	}
}
