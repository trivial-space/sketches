import { getShade, getSketch } from '../../shared-utils/painterState'
import { repeat, stop } from '../../shared-utils/scheduler'
import { canvas, gl, painter } from './context'
import { lineForm, pointsForm, updateGeometries } from './geometries'
import { updateNodes } from './nodes'
import lineFrag from './shaders/line.frag'
import lineVert from './shaders/line.vert'
import pointFrag from './shaders/point.frag'
import pointVert from './shaders/point.vert'

// ===== shaders =====

const pointsShade = getShade(painter, 'point').update({
	vert: pointVert,
	frag: pointFrag,
})

const linesShade = getShade(painter, 'line').update({
	vert: lineVert,
	frag: lineFrag,
})

// ===== objects =====

const points = getSketch(painter, 'point').update({
	form: pointsForm,
	shade: pointsShade,
	uniforms: { size: [canvas.width, canvas.height] },
})

const lines = getSketch(painter, 'lines').update({
	form: lineForm,
	shade: linesShade,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: gl.COLOR_BUFFER_BIT,
		cullFace: gl.BACK,
		enable: [gl.CULL_FACE],
	},
	uniforms: { size: [canvas.width, canvas.height] },
})

// ===== render =====

const timeToSort = 10
let time = 0
repeat(tpf => {
	time += tpf

	updateNodes(tpf)
	updateGeometries()

	painter.draw(lines)
	painter.draw(points)

	if (time >= timeToSort * 1000) stop('render')
}, 'render')
