import { mat4 } from 'gl-matrix'
import {
	addSystem,
	getEffect,
	getForm,
	getFrame,
	getShade,
	getSketch,
} from '../../shared-utils/painterState'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { plane } from 'tvs-painter/dist/utils/geometry/plane'
import { events, gl, paint, painter } from './context'
import base from './glsl/base.frag'
import planeFrag from './glsl/plane-material.frag'
import planeVert from './glsl/plane-material.vert'

// ===== gof layers =====

const paintFrame = getFrame(painter, 'paint')

const bufferSize = 256

const effect = getEffect(painter, 'layer').update({
	frag: base,
	uniforms: {
		size: bufferSize,
		paint: () => paintFrame.image(),
		previous: '0',
	},
})

export const automaton = getFrame(painter, 'automaton').update({
	layers: effect,
	selfReferencing: true,
	width: bufferSize,
	height: bufferSize,
	bufferStructure: [
		{
			flipY: true,
			wrap: 'REPEAT',
		},
	],
})

// ===== scene =====

const planMat = mat4.fromTranslation(mat4.create(), [0, 0, -3])
const rotation = 0.001
const projection = mat4.perspective(mat4.create(), 45, 1, 0.01, 10)

const form = getForm(painter, 'plane').update(plane(2, 2))

const shade = getShade(painter, 'plane').update({
	vert: planeVert,
	frag: planeFrag,
})

export const sketch = getSketch(painter, 'plane').update({
	form,
	shade,
	uniforms: {
		projection,
		transform: () => mat4.rotateY(planMat, planMat, rotation),
		tex: () => automaton.image(),
	},
	drawSettings: {
		clearColor: [0.0, 1.0, 0.0, 1.0],
		clearBits: makeClear(gl, 'color'),
	},
})

// ===== state =====

addSystem('renderer', e => {
	if (e === events.FRAME) {
		paintFrame.update({ texture: { asset: paint } })
	}
})
