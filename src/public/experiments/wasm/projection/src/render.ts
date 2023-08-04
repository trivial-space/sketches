import {
	assign,
	defMain,
	mul,
	normalize,
	vec3,
	vec4,
	float,
	Vec4Sym,
	$xyz,
	sym,
	Vec3Sym,
	sub,
	add,
	neg,
} from '@thi.ng/shader-ast'
import { diffuseLighting, halfLambert } from '@thi.ng/shader-ast-stdlib'
import { FormData } from 'tvs-painter'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { Q } from './context'
import { defShader } from '../../../../../shared-utils/shaders/ast'
import { Sketch } from 'tvs-painter/dist/sketch'
import { specularLight } from '../../../../../shared-utils/shaders/lights'

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
		modelMat: 'mat4',
		cameraMat: 'mat4',
		normalMatrix: 'mat3',
		lightDir: 'vec3',
		lightPos: 'vec3',
		eyePos: 'vec3',
		color: 'vec3',
	},
	varying: {
		vNormal: 'vec3',
		vPos: 'vec3',
	},
	vs: (gl, uniforms, inp, out) => {
		let pos: Vec4Sym
		return [
			defMain(() => [
				(pos = sym(mul(uniforms.modelMat, vec4(inp.position, 1)))),
				assign(out.vPos, $xyz(pos)),
				assign(gl.gl_Position, mul(uniforms.cameraMat, pos)),
				assign(gl.gl_PointSize, float(2)),
				assign(out.vNormal, mul(uniforms.normalMatrix, inp.normal)),
			]),
		]
	},
	fs: (gl, uniforms, inp, out) => [
		defMain(() => {
			let specular: Vec3Sym
			let diffuse: Vec3Sym
			let lightDir: Vec3Sym
			let eyeDir: Vec3Sym
			let normal: Vec3Sym
			return [
				(normal = sym(normalize(inp.vNormal))),
				(diffuse = sym(
					diffuseLighting(
						halfLambert(normal, neg(uniforms.lightDir)),
						uniforms.color,
						vec3(1, 1, 1),
						vec3(0.1, 0, 0),
					),
				)),
				(lightDir = sym(normalize(sub(uniforms.lightPos, inp.vPos)))),
				(eyeDir = sym(normalize(sub(uniforms.eyePos, inp.vPos)))),
				(specular = sym(
					specularLight(
						normal,
						lightDir,
						eyeDir,
						// uniforms.color,
						vec3(1),
						float(100),
						vec3(1),
					),
				)),
				assign(out.fragColor, vec4(add(diffuse, specular), 0.8)),
			]
		}),
	],
})
console.log('shader', shader)
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
	frameData: {
		objects: {
			id: number
			color: number[]
			model_mat: number[]
			normal_mat: number[]
		}[]
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
		sketches: [
			groundSketch.update({
				uniforms: { color: [0.5, 0.5, 0.5] },
			}),
		].concat(frameData.objects.map((o) => glassSketches[o.id])),
		uniforms: {
			lightDir: light.dir,
			lightPos: light.pos,
			eyePos: frameData.camera_pos,
			cameraMat: frameData.camera_mat,
		},
		directRender: true,
	})
}
