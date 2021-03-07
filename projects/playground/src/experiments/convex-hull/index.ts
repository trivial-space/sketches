import { repeat, stop } from '../../shared-utils/scheduler'
import { flatten } from 'tvs-libs/dist/utils/sequence'
import { canvas, Q } from './context'
import { nodes, triples } from './nodes'
import blendFrag from './shaders/compose.frag'
import pointFrag from './shaders/point.frag'
import pointVert from './shaders/point.vert'
import sideFrag from './shaders/side.frag'

const { gl } = Q

// ===== shaders =====

const pointsShade = Q.getShade('point').update({
	vert: pointVert,
	frag: pointFrag,
})

// ===== geometries =====

const pointsForm = Q.getForm('points').update({
	drawType: 'POINTS',
	attribs: {
		position: {
			buffer: new Float32Array(flatten(nodes)),
			storeType: 'DYNAMIC',
		},
	},
	itemCount: nodes.length,
})

// ===== objects =====

const pointsSketch = Q.getSketch('points').update({
	form: pointsForm,
	shade: pointsShade,
})

// ===== layers =====

const points = Q.getLayer('points').update({
	sketches: [pointsSketch],
	uniforms: { size: () => [canvas.width, canvas.height] },
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: gl.COLOR_BUFFER_BIT,
		enable: [gl.BLEND],
		blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
	},
})

const currentTriple = Q.getEffect('sides').update({
	frag: sideFrag,
})

const current = Q.getFrame('current').update({
	layers: [points, currentTriple],
})

const blend = Q.getEffect('blend').update({
	frag: blendFrag,
	uniforms: {
		previous: '0',
		current: () => current.image(),
	},
})

const main = Q.getFrame('main').update({
	layers: blend,
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

	Q.painter.compose(current, main).display(main)

	console.log(i++)

	if (i === triples.length) stop('render')
}, 'render')

console.log(triples.length)

import.meta.webpackHot?.accept()
