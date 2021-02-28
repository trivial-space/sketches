import { repeat, stop } from '../../shared-utils/scheduler'
import { canvas, Q } from './context'
import { lineForm, pointsForm, updateGeometries } from './geometries'
import { updateNodes } from './nodes'
import lineFrag from './shaders/line.frag'
import lineVert from './shaders/line.vert'
import pointFrag from './shaders/point.frag'
import pointVert from './shaders/point.vert'

// ===== shaders =====

const pointsShade = Q.getShade('point').update({
	vert: pointVert,
	frag: pointFrag,
})

const linesShade = Q.getShade('line').update({
	vert: lineVert,
	frag: lineFrag,
})

// ===== objects =====

const points = Q.getSketch('point').update({
	form: pointsForm,
	shade: pointsShade,
	uniforms: { size: [canvas.width, canvas.height] },
})

const lines = Q.getSketch('lines').update({
	form: lineForm,
	shade: linesShade,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		cullFace: Q.gl.BACK,
		enable: [Q.gl.CULL_FACE],
	},
	uniforms: { size: [canvas.width, canvas.height] },
})

// ===== render =====

const timeToSort = 10
let time = 0
repeat((tpf) => {
	time += tpf

	updateNodes(tpf)
	updateGeometries()

	Q.painter.draw(lines)
	Q.painter.draw(points)

	if (time >= timeToSort * 1000) stop('render')
}, 'render')
