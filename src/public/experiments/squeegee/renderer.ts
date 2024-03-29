import { flatten } from 'tvs-libs/dist/utils/sequence'
import { getNoiseTextureData } from '../../../shared-utils/graphics/texture-helpers'
import { initPerspectiveViewport } from '../../../shared-utils/vr/perspectiveViewport'
import { events, Q } from './context'
import { lineFrag, lineVert } from './shaders'

initPerspectiveViewport(Q, { position: [0, 0, 15] })

const shade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

const form = Q.getForm('line')

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

const sketch = Q.getSketch('line').update({
	form,
	shade,
	uniforms: {
		noiseTex: noiseTex.image(),
	},
})

// === scene ===

export const scene = Q.getLayer('scene').update({
	sketches: [sketch],
	uniforms: {
		view: () => Q.state.viewPort.camera.viewMat,
		projection: () => Q.state.viewPort.camera.projectionMat,
	},
	drawSettings: {
		clearColor: [1, 1, 1, 1],
		// clearBits: painter.gl.COLOR_BUFFER_BIT,
		enable: [Q.gl.BLEND, Q.gl.CULL_FACE],
		cullFace: Q.gl.BACK,
	},
})

Q.listen('renderer', events.FRAME, ({ squeegee }) => {
	form.update({
		attribs: {
			position: {
				buffer: new Float32Array(
					flatten(squeegee.lineStartPoints.concat(squeegee.lineEndPoints)),
				),
				storeType: 'DYNAMIC',
			},
			uv: {
				buffer: new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]),
				storeType: 'DYNAMIC',
			},
		},
		drawType: 'TRIANGLE_STRIP',
		itemCount: 4,
	})
})
