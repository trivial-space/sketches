import { planeForm } from './geometries'
import frag from './glsl/base.frag'
import vert from './glsl/base.vert'
import { initPerspectiveViewport } from '../shared-utils/vr/perspectiveViewport'
import { $ } from './context'

initPerspectiveViewport($)

// ===== shaders =====

export const baseShade = $.getShade('base').update({ vert, frag })

// ===== objects =====

const sketch = $.getSketch('quad').update({
	form: planeForm,
	shade: baseShade,
	uniforms: { transform: () => $.state.entities.quad.transform },
})

// ===== layers =====

const scene = $.getLayer('scene').update({
	sketches: [sketch],
	uniforms: {
		view: () => $.state.viewPort.camera.viewMat,
		projection: () => $.state.viewPort.camera.projectionMat,
	},
	drawSettings: {
		clearBits: $.gl.DEPTH_BUFFER_BIT | $.gl.COLOR_BUFFER_BIT,
	},
})

export const main = $.getFrame('main').update({
	layers: scene,
})
