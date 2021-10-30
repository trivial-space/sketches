import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'
import { makeLine } from './state'
import { getNoiseTextureData } from '../../../../shared-utils/texture-helpers'
import { lineToSmouthTriangleStripGeometry } from '../../../../shared-utils/geometry/lines_2d'

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

// const linePoints = line([-0.5, 0], [0.5, 0], 30)
const line = makeLine(1, 1, 5)

const data = lineToSmouthTriangleStripGeometry(line, 20)
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
		enable: [Q.gl.BLEND, Q.gl.CULL_FACE],
		cullFace: Q.gl.BACK,
	},
	uniforms: {
		noiseTex: noiseTex.image(),
	},
	directRender: true,
})

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
	console.log(scene._targets[0].width, Q.gl.drawingBufferWidth)
})

import.meta.hot?.accept()
