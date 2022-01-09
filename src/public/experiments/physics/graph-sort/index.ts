import { hsl, hslToRGB } from 'tvs-libs/dist/graphics/colors'
import { repeat, stop } from '../../../../shared-utils/scheduler'
import { createLines2DSketch } from '../../../../shared-utils/sketches/lines/lines'
import { createPoints2DSketch } from '../../../../shared-utils/sketches/points/points'
import { Q } from './context'
import { connections, nameSpaceCount, nodes, updateNodes } from './nodes'

export const points = createPoints2DSketch(Q, 'points', {
	pointSize: 20,
	dynamicForm: true,
})

export const lines = createLines2DSketch(Q, 'lines', {
	lineWidth: 3,
	color: [1, 1, 1, 1],
	dynamicForm: true,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		cullFace: Q.gl.BACK,
		enable: [Q.gl.CULL_FACE],
	},
})

const timeToSort = 10
let time = 0

repeat((tpf) => {
	time += tpf

	updateNodes(tpf)

	points.update({
		positions: nodes.map((n) => n.pos),
		colors: nodes.map((n) => [
			...hslToRGB(hsl(n.ns / nameSpaceCount, 1, 0.5)),
			1,
		]),
	})

	lines.update({
		segments: connections.map(([p1, p2]) => [nodes[p1].pos, nodes[p2].pos]),
	})

	Q.painter.draw({ sketches: [lines.sketch, points.sketch] })

	if (time >= timeToSort * 1000) stop('render')
}, 'render')

import.meta.hot?.accept()
