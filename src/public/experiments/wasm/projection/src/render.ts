import {
	assign,
	defMain,
	mul,
	normalize,
	vec3,
	vec4,
	float,
} from '@thi.ng/shader-ast'
import { diffuseLighting, halfLambert } from '@thi.ng/shader-ast-stdlib'
import { FormData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Q } from './context'
import { defShader } from '../../../../../shared-utils/shaders/ast'
import { Sketch } from 'tvs-painter/dist/sketch'

Q.painter.updateDrawSettings({
	enable: [Q.gl.DEPTH_TEST, Q.gl.BLEND],

	clearBits: makeClear(Q.gl, 'depth', 'color'),
})

const shader = defShader({
	attribs: {
		position: 'vec3',
		normal: 'vec3',
	},
	uniforms: {
		camera: 'mat4',
		normalMatrix: 'mat3',
		light: 'vec3',
		color: 'vec3',
	},
	varying: {
		vNormal: 'vec3',
	},
	vs: (gl, uniforms, inp, out) => [
		defMain(() => [
			assign(gl.gl_Position, mul(uniforms.camera, vec4(inp.position, 1))),
			assign(gl.gl_PointSize, float(2)),
			assign(out.vNormal, mul(uniforms.normalMatrix, inp.normal)),
		]),
	],
	fs: (gl, uniforms, inp, out) => [
		defMain(() => [
			assign(
				out.fragColor,
				vec4(
					diffuseLighting(
						halfLambert(normalize(inp.vNormal), uniforms.light),
						uniforms.color,
						vec3(1, 1, 1),
						vec3(0.1, 0, 0),
					),
					0.8,
				),
			),
		]),
	],
})
const shade = Q.getShade('glass').update(shader)

let glassSketches: Sketch[] = []
let groundSketch = Q.getSketch('ground')

export function renderInit(
	glassGeometries: FormData[],
	groundGeometry: FormData,
) {
	glassSketches = glassGeometries.map((g, i) => {
		const form = Q.getForm('glass' + i).update(g)
		return Q.getSketch('glass' + i).update({ shade, form })
	})
	groundSketch.update({
		form: Q.getForm('ground').update(groundGeometry),
		shade,
	})
}

export function render(
	objects: {
		id: number
		color: number[]
		mvp: number[]
		normal_mat: number[]
	}[],
	viewMat: Float32Array,
	light: Float32Array,
) {
	objects.forEach((o) => {
		glassSketches[o.id].update({
			uniforms: {
				camera: o.mvp,
				normalMatrix: o.normal_mat,
				color: o.color,
			},
		})
	})
	Q.painter.draw({
		sketches: [
			groundSketch.update({
				uniforms: { camera: viewMat, color: [0.5, 0.5, 0.5] },
			}),
		].concat(objects.map((o) => glassSketches[o.id])),
		uniforms: { light },
		directRender: true,
	})
}
