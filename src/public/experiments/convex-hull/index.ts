import {
	addToLoop,
	stopLoop,
	startLoop,
} from '../../../shared-utils/app/frameLoop'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'
import { canvas, Q } from './context'
import { nodes, triples } from './nodes'
import blendFrag from './shaders/compose.frag.glsl?raw'
import pointFrag from './shaders/point.frag.glsl?raw'
import sideFrag from './shaders/side.frag.glsl?raw'

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
addToLoop(() => {
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

	if (i === triples.length) stopLoop()
}, 'render')

console.log(triples.length)

startLoop()

if (import.meta.hot) {
	import.meta.hot.accept()
}
