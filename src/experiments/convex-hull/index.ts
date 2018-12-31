import {
	getLayer,
	getEffect,
	getForm,
	getShade,
	getSketch,
} from 'shared-utils/painterState'
import { repeat, stop } from 'shared-utils/scheduler'
import { flatten } from 'tvs-libs/dist/utils/sequence'
import { canvas, gl, painter } from './context'
import { nodes, triples } from './nodes'
import composeFrag from './shaders/compose.frag'
import pointFrag from './shaders/point.frag'
import pointVert from './shaders/point.vert'
import sideFrag from './shaders/side.frag'

// ===== shaders =====

const pointsShade = getShade(painter, 'point').update({
	vert: pointVert,
	frag: pointFrag,
})

// ===== geometries =====

const pointsForm = getForm(painter, 'points').update({
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

const pointsSketch = getSketch(painter, 'points').update({
	form: pointsForm,
	shade: pointsShade,
})

// ===== layers =====

const points = getLayer(painter, 'points').update({
	sketches: [pointsSketch],
	uniforms: { size: () => [canvas.width, canvas.height] },
	drawSettings: {
		clearColor: [0, 0, 0, 1],
		clearBits: gl.COLOR_BUFFER_BIT,
		enable: [gl.BLEND],
		blendFunc: [gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA],
	},
})

const sides = getEffect(painter, 'sides').update({
	frag: sideFrag,
})

const bufferOpts = {
	buffered: true,
	width: canvas.width,
	height: canvas.height,
	frag: composeFrag,
}
const outBuffer1 = getEffect(painter, 'outBuf1').update(bufferOpts)
const outBuffer2 = getEffect(painter, 'outBuf2').update(bufferOpts)

outBuffer1.update({
	uniforms: {
		previous: outBuffer2.texture(),
		current: null,
	},
})

outBuffer2.update({
	uniforms: {
		previous: outBuffer1.texture(),
		current: null,
	},
})

// ===== render =====

let layers = [points, sides, outBuffer1, outBuffer2]
let i = 0
repeat(() => {
	const triple = triples[i]

	sides.update({
		uniforms: {
			// triples.map(triple => ({
			size: [canvas.width, canvas.height],
			p1: triple[0],
			p2: triple[1],
			p3: triple[2],
			source: null,
		}, // ))
	})

	const [p, s, o1, o2] = layers
	painter.compose(
		p,
		s,
		o1,
		o2,
	)
	layers = [p, s, o2, o1]
	console.log(i++)

	if (i === triples.length) stop('render')
}, 'render')

console.log(triples.length)
