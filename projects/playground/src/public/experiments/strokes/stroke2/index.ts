import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import { makeLine, makeLine2 } from './state'
import { getNoiseTextureData } from '../../../../shared-utils/texture-helpers'
import { lineToSmouthTriangleStripGeometry } from '../../../../shared-utils/geometry/lines_2d'

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

// const linePoints = line([-0.5, 0], [0.5, 0], 30)
const line = makeLine2(1.2, 0.6, 5)

const data = lineToSmouthTriangleStripGeometry(line, 0.07)
console.log(data)

const sketches = data
	.map((d, i) => Q.getForm('form' + i).update(d))
	.map((form, i) =>
		Q.getSketch('line' + i).update({
			form,
			shade,
		}),
	)

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
	sketches,
	drawSettings: {
		clearColor: [1, 1, 1, 1],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		enable: [
			Q.gl.BLEND,
			//
			Q.gl.CULL_FACE,
		],
		cullFace: Q.gl.BACK,
	},
	directRender: true,
})
Q.gl.blendFuncSeparate(
	Q.gl.SRC_ALPHA,
	Q.gl.ONE_MINUS_SRC_ALPHA,
	Q.gl.ZERO,
	Q.gl.ONE,
)

Q.listen('index', events.RESIZE, () => {
	scene.update()
	scene.update({
		uniforms: {
			noiseTex: noiseTex.image(),
			size: [scene.width, scene.height],
		},
	})
	Q.painter.compose(scene)
})
Q.painter.compose(scene)

import.meta.hot?.accept()
