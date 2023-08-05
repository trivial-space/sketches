import { FormData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Q } from './context'
import { Sketch } from 'tvs-painter/dist/sketch'
import { glassLitShader, groundShader } from './shaders'

const glassShade = Q.getShade('glass').update(glassLitShader)
const groundShade = Q.getShade('ground').update(groundShader)

let glassSketches: Sketch[] = []
let groundSketch = Q.getSketch('ground')

type Obj = {
	id: number
	color: number[]
	model_mat: number[]
	normal_mat: number[]
}

export function renderInit(
	glassGeometries: FormData[],
	groundGeometry: FormData,
	ground: Obj,
) {
	glassSketches = glassGeometries.map((g, i) => {
		const form = Q.getForm('glass' + i).update(g)
		return Q.getSketch('glass' + i).update({ shade: glassShade, form })
	})
	groundSketch.update({
		form: Q.getForm('ground').update(groundGeometry),
		shade: groundShade,
		uniforms: {
			modelMat: ground.model_mat,
			normalMatrix: ground.normal_mat,
			color: ground.color,
		},
	})
}

export function render(
	frameData: {
		objects: Obj[]
		camera_mat: number[]
		camera_pos: number[]
	},
	light: { color: number[]; dir: number[]; pos: number[] },
) {
	frameData.objects.forEach((o) => {
		glassSketches[o.id].update({
			uniforms: {
				modelMat: o.model_mat,
				normalMatrix: o.normal_mat,
				color: o.color,
			},
		})
	})
	Q.painter.draw({
		sketches: [groundSketch].concat(
			frameData.objects.map((o) => glassSketches[o.id]),
		),
		uniforms: {
			lightDir: light.dir,
			lightPos: light.pos,
			lightColor: [1, 1, 1],
			eyePos: frameData.camera_pos,
			cameraMat: frameData.camera_mat,
		},
		drawSettings: {
			enable: [Q.gl.DEPTH_TEST, Q.gl.BLEND],
			clearBits: makeClear(Q.gl, 'depth', 'color'),
			clearColor: [0, 0, 0, 1],
		},
	})
}
