import { events, Q } from './context'
import {
	createLine,
	lineToFormCollection,
	newLinePoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { Buttons } from 'tvs-libs/dist/events/pointer'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Sketch } from 'tvs-painter/dist/sketch'
import { baseEvents } from '../../../../shared-utils/painterState'
import { getNoiseTextureData } from '../../../../shared-utils/texture-helpers'
import {
	brushStrokeFrag,
	brushStrokeVert,
} from '../../../../shared-utils/shaders/brushStrokeLineShader'

Q.state.device.sizeMultiplier = window.devicePixelRatio

const lineWidth = 50

let currentLine = createLine().append(newLinePoint([0, 0], lineWidth))

let sketches: Sketch[] = []

const shade = Q.getShade('shade').update({
	frag: brushStrokeFrag,
	vert: brushStrokeVert,
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

const scene = Q.getLayer('scene').update({
	drawSettings: {
		clearColor: [1, 1, 1, 1],
		clearBits: makeClear(Q.gl, 'color', 'depth'),
		enable: [Q.gl.BLEND],
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.ZERO,
			Q.gl.ONE,
		],
	},
	directRender: true,
})

let dragging = false
let startPoint: [number, number] = [0, 0]

Q.listen('index', baseEvents.POINTER, (s) => {
	const p = s.device.pointer
	if (p.dragging) {
		const m = Q.state.device.sizeMultiplier
		if (!dragging) {
			dragging = true
			startPoint = [
				p.pressed[Buttons.LEFT].clientX * m,
				p.pressed[Buttons.LEFT].clientY * m,
			]

			const point = newLinePoint([startPoint[0], startPoint[1]], lineWidth)

			currentLine = createLine().append(point)
		} else {
			const point = newLinePoint(
				[startPoint[0] - p.drag.x * m, startPoint[1] - p.drag.y * m],
				lineWidth,
			)
			currentLine?.append(point, true)

			const formDatas = lineToFormCollection(currentLine, {
				lineWidth,
				smouthCount: 3,
				storeType: 'DYNAMIC',
			})

			sketches = formDatas
				.map((formData, i) => Q.getForm('line' + i).update(formData))
				.map((form, i) => Q.getSketch('sketch' + i).update({ form, shade }))

			scene.update({
				sketches,
				uniforms: {
					size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
					noiseTex: noiseTex.image(),
					color: [0.9, 0.2, 0.7],
					texScale: [10, 0.1],
					edgeSharpness: 4,
				},
			})

			Q.painter.compose(scene)
		}
	} else if (!p.dragging && dragging) {
		dragging = false
	}
})

Q.listen('index', events.RESIZE, () => {
	scene.update()
	Q.painter.compose(scene)
	Q.painter.show(noiseTex)
})
