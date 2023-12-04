import { FormData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Q } from './context'
import { normalDepthPositionShader, objectShader } from './shaders'
import { SAOFragmentShader, defaultSAOUniforms } from './sao-shader'

const groundSketch = Q.getSketch('ground')
const objectSketch = Q.getSketch('object')

const groundNDPSketch = Q.getSketch('groundNDP')
const objectNDPSketch = Q.getSketch('objectNDP')

const objectShade = Q.getShade('object').update(objectShader)
const ndpShade = Q.getShade('ndp').update(normalDepthPositionShader)

Q.painter.updateDrawSettings({
	enable: [Q.gl.DEPTH_TEST, Q.gl.CULL_FACE],
	cullFace: Q.gl.BACK,
})

Q.state.device.sizeMultiplier = window.devicePixelRatio

const renderLayer = Q.getLayer('render').update({
	sketches: [groundSketch, objectSketch],
	drawSettings: {
		clearBits: makeClear(Q.gl, 'depth', 'color'),
		clearColor: [0, 0, 0, 1],
	},
})

const normalDepthPositionLayer = Q.getLayer('ndp').update({
	bufferCount: 2,
	sketches: [groundNDPSketch, objectNDPSketch],
	drawSettings: {
		clearBits: makeClear(Q.gl, 'depth', 'color'),
		clearColor: [0, 0, 0, 1],
	},
})

export function renderInit(objectGeometry: FormData, groundGeometry: FormData) {
	const objectForm = Q.getForm('object').update(objectGeometry)
	const groundForm = Q.getForm('ground').update(groundGeometry)
	objectSketch.update({
		form: objectForm,
		shade: objectShade,
	})
	groundSketch.update({
		form: groundForm,
		shade: objectShade,
	})
	objectNDPSketch.update({
		form: objectForm,
		shade: ndpShade,
	})
	groundNDPSketch.update({
		form: groundForm,
		shade: ndpShade,
	})
}

const saoEffect = Q.getEffect('sao').update({
	frag: SAOFragmentShader,
	uniforms: {
		...defaultSAOUniforms,
		tNormalDepth: () => normalDepthPositionLayer.image(0),
		tViewPosition: () => normalDepthPositionLayer.image(1),
	},
})

const saoLayer = Q.getLayer('sao').update({
	drawSettings: {
		clearBits: makeClear(Q.gl, 'color'),
		clearColor: [1, 1, 1, 1],
	},
	effects: [saoEffect],
})

const renderUniforms = {
	lightColor: [1, 0.9, 0.9],
}

export function render(data: {
	view_mat: number[]
	proj_mat: number[]
	view_normal_mat: number[]
	light_pos: number[]
	light_dir: number[]
	light_view_pos: number[]
	light_view_dir: number[]
}) {
	renderLayer.update({
		uniforms: {
			...renderUniforms,
			viewMat: data.view_mat,
			projMat: data.proj_mat,
			lightPos: data.light_pos,
			lightDir: data.light_dir,
		},
	})
	saoLayer.update({
		uniforms: {
			randomSeed: Math.random() * 10,
			size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
			// randomSeed: 0,
		},
	})
	normalDepthPositionLayer.update({
		uniforms: {
			viewMat: data.view_mat,
			projMat: data.proj_mat,
			viewNormalMat: data.view_normal_mat,
		},
	})

	Q.painter
		.compose(normalDepthPositionLayer, saoLayer, renderLayer)
		.show(saoLayer)
}
