import { FormData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Q } from './context'
import { objectShader } from './shaders'
import { SAOFragmentShader, defaultSAOUniforms } from './sao-shader'

const groundSketch = Q.getSketch('ground')
const objectSketch = Q.getSketch('object')

const objectShade = Q.getShade('object').update(objectShader)

Q.painter.updateDrawSettings({
	enable: [Q.gl.DEPTH_TEST, Q.gl.CULL_FACE],
	cullFace: Q.gl.BACK,
})

Q.state.device.sizeMultiplier = window.devicePixelRatio

const renderLayer = Q.getLayer('render').update({
	bufferStructure: [{ type: 'FLOAT' }, { type: 'FLOAT' }],
	drawSettings: {
		clearBits: makeClear(Q.gl, 'depth', 'color'),
		clearColor: [0, 0, 0, 1],
	},
})

export function renderInit(objectGeometry: FormData, groundGeometry: FormData) {
	objectSketch.update({
		form: Q.getForm('object').update(objectGeometry),
		shade: objectShade,
	})
	groundSketch.update({
		form: Q.getForm('ground').update(groundGeometry),
		shade: objectShade,
	})
}

const renderUniforms = {
	lightColor: [1, 0.9, 0.9],
	lightPos: [0, 3, 20],
	lightDir: [0, 0, -1],
}

renderLayer.update({
	sketches: [groundSketch, objectSketch],
})

const saoEffect = Q.getEffect('sao').update({
	frag: SAOFragmentShader,
	uniforms: {
		...defaultSAOUniforms,
		tDiffuse: () => renderLayer.image(0),
		tNormalDepth: () => renderLayer.image(1),
	},
})

const saoLayer = Q.getLayer('sao').update({
	effects: [saoEffect],
})

export function render(data: { camera_mat: number[]; camera_pos: number[] }) {
	renderLayer.update({
		uniforms: {
			...renderUniforms,
			eyePos: data.camera_pos,
			cameraMat: data.camera_mat,
		},
	})

	Q.painter.compose(renderLayer, saoLayer).show(saoLayer)
}
