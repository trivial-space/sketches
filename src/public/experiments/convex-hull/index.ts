import { repeat, stop } from '../../../shared-utils/scheduler'
import { canvas, Q } from './context'
import { nodes, triples } from './nodes'
import blendFrag from './shaders/compose.frag.glsl'
import pointFrag from './shaders/point.frag.glsl'
import sideFrag from './shaders/side.frag.glsl'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'

const { gl } = Q

// ===== geometries =====

const pointSketch = createPoints2DSketch(Q, 'points', {
	frag: pointFrag,
	pointSize: 12,
	color: [1, 1, 0, 1],
	positions: nodes,
})

// ===== layers =====

const currentTriple = Q.getEffect('sides').update({
	frag: sideFrag,
})

const points = Q.getLayer('points').update({
	sketches: pointSketch.sketch,
	effects: currentTriple,
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: gl.COLOR_BUFFER_BIT,
		enable: [gl.BLEND],
		blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
	},
})

const blend = Q.getEffect('blend').update({
	frag: blendFrag,
	uniforms: {
		previous: '0',
		current: () => points.image(),
	},
})

const main = Q.getLayer('main').update({
	effects: blend,
	selfReferencing: true,
})

// ===== render =====

let i = 0
repeat(() => {
	const triple = triples[i]

	currentTriple.update({
		uniforms: {
			// triples.map(triple => ({
			size: [canvas.width, canvas.height],
			p1: triple[0],
			p2: triple[1],
			p3: triple[2],
			source: '0',
		}, // ))
	})

	Q.painter.compose(points, main).show(main)

	console.log(i++)

	if (i === triples.length) stop('render')
}, 'render')

console.log(triples.length)

if (import.meta.hot) {
	import.meta.hot.accept()
}
