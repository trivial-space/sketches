import { FormData } from 'tvs-painter'
import { Sketch } from 'tvs-painter/dist/sketch'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { baseEvents } from '../../../../../shared-utils/app/painterState'
import { Q, getRndTex } from './context'
import {
	colorGradeShader,
	glassLitShader,
	glassProjectionShader,
	groundShader,
} from './shaders'

const glassShade = Q.getShade('glass').update(glassLitShader)
const glassProjShade = Q.getShade('glassProj').update(glassProjectionShader)
const groundShade = Q.getShade('ground').update(groundShader)

const projectionSketches: Sketch[] = []
const glassSketches: Sketch[] = []
const groundSketch = Q.getSketch('ground')

type ObjData = {
	color: number[]
	model_mat: number[]
	normal_mat: number[]
}

type LightData = {
	color: number[]
	dir: number[]
	pos: number[]
	cam_projection: number[]
	texcoord_projection: number[]
}

Q.painter.updateDrawSettings({
	enable: [Q.gl.BLEND, Q.gl.DEPTH_TEST, Q.gl.CULL_FACE],
	cullFace: Q.gl.BACK,
})

Q.state.device.sizeMultiplier = window.devicePixelRatio

const projLayer = Q.getLayer('proj').update({
	width: 2048,
	height: 2048,
	bufferOptions: {
		magFilter: 'LINEAR',
		minFilter: 'LINEAR',
	},
	drawSettings: {
		clearBits: makeClear(Q.gl, 'depth', 'color'),
		clearColor: [1, 1, 1, 1],
	},
})

const canUseFloatBlending = Q.gl.getExtension('EXT_float_blend')

const renderLayer = Q.getLayer('render').update({
	bufferType: canUseFloatBlending ? 'FLOAT' : 'UNSIGNED_BYTE',
	drawSettings: {
		clearBits: makeClear(Q.gl, 'depth', 'color'),
		clearColor: [0, 0, 0, 1],
	},
})

export function renderInit(
	glassGeometries: FormData[],
	groundGeometry: FormData,
	ground: ObjData,
) {
	glassGeometries
		.map((g, i) => Q.getForm('glass' + i).update(g))
		.forEach((form, i) => {
			glassSketches.push(
				Q.getSketch('glass' + i).update({
					form,
					shade: glassShade,
				}),
			)
			projectionSketches.push(
				Q.getSketch('glassProj' + i).update({
					form,
					shade: glassProjShade,
				}),
			)
		})

	groundSketch.update({
		form: Q.getForm('ground').update(groundGeometry),
		shade: groundShade,
		uniforms: {
			modelMat: ground.model_mat,
			normalMat: ground.normal_mat,
			color: ground.color,
			projectedTex: () => projLayer.image(),
		},
	})
}

const randLayer = Q.getLayer('rand').update({
	texture: {
		data: getRndTex(),
	},
})

Q.listen('render_resize', baseEvents.RESIZE, () => {
	randLayer.update({
		texture: { data: getRndTex() },
	})
	renderLayer.update()
	projLayer.update()
})

export function render(data: {
	objects: ObjData[]
	camera_mat: number[]
	camera_pos: number[]
	cam_indices: number[]
	proj_indices: number[]
	light: LightData
}) {
	const light = data.light
	data.objects.forEach((o, i) => {
		glassSketches[i].update({
			uniforms: {
				modelMat: o.model_mat,
				normalMat: o.normal_mat,
				color: o.color,
			},
		})
		projectionSketches[i].update({
			uniforms: {
				modelMat: o.model_mat,
				color: o.color,
			},
		})
	})

	projLayer.update({
		sketches: data.proj_indices.map((i) => projectionSketches[i]),
		uniforms: {
			cameraMat: light.cam_projection,
		},
	})

	renderLayer.update({
		sketches: [groundSketch].concat(
			data.cam_indices.map((i) => glassSketches[i]),
		),
		uniforms: {
			lightDir: light.dir,
			lightPos: light.pos,
			lightColor: [1, 1, 1],
			eyePos: data.camera_pos,
			cameraMat: data.camera_mat,
			textureMat: light.texcoord_projection,
		},
	})

	const effect = Q.getEffect('colorGrade').update({
		frag: colorGradeShader,
		uniforms: {
			source: renderLayer.image(),
			rand: randLayer.image(),
		},
	})

	Q.painter.compose(projLayer, renderLayer).draw({
		effects: effect,
	})
}
