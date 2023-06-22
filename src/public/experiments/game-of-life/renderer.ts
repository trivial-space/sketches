import { mat4 } from 'gl-matrix'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { plane } from 'tvs-painter/dist/utils/geometry/plane'
import { events, Q, paint } from './context'
import base from './glsl/base.frag.glsl?raw'
import planeFrag from './glsl/plane-material.frag.glsl?raw'
import planeVert from './glsl/plane-material.vert.glsl?raw'

// ===== gof layers =====

const paintLayer = Q.getLayer('paint')

const bufferSize = 256

const effect = Q.getEffect('layer').update({
	frag: base,
	uniforms: {
		size: bufferSize,
		paint: () => paintLayer.image(),
		previous: '0',
	},
})

export const automaton = Q.getLayer('automaton').update({
	effects: effect,
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

const form = Q.getForm('plane').update(plane(2, 2))

const shade = Q.getShade('plane').update({
	vert: planeVert,
	frag: planeFrag,
})

export const sketch = Q.getSketch('plane').update({
	form,
	shade,
	uniforms: {
		projection,
		transform: () => mat4.rotateY(planMat, planMat, rotation),
		tex: () => automaton.image(),
	},
	drawSettings: {
		clearColor: [0.0, 1.0, 0.0, 1.0],
		clearBits: makeClear(Q.gl, 'color'),
	},
})

// ===== state =====

Q.listen('renderer', events.FRAME, () => {
	paintLayer.update({ texture: { asset: paint } })
})
