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
	div,
	FloatSym,
	length,
	dot,
	abs,
	$w,
	sub,
} from '@thi.ng/shader-ast'
import { diffuseLighting } from '@thi.ng/shader-ast-stdlib'
import { defShader } from '../../../../../shared-utils/shaders/ast'
import {
	distanceDivisor,
	spotLight,
} from '../../../../../shared-utils/shaders/lights'

const spotLightFactor = 10

export const objectShader = defShader({
	attribs: {
		position: 'vec3',
		normal: 'vec3',
	},
	uniforms: {
		viewMat: 'mat4',
		projMat: 'mat4',
		lightPos: 'vec3',
		lightDir: 'vec3',
		lightColor: 'vec3',
	},
	varying: {
		vNormal: 'vec3',
		vPos: 'vec3',
	},
	vs(gl, uniforms, inp, out) {
		return [
			defMain(() => [
				assign(
					gl.gl_Position,
					mul(uniforms.projMat, mul(uniforms.viewMat, vec4(inp.position, 1))),
				),
				assign(out.vPos, inp.position),
				assign(out.vNormal, inp.normal),
			]),
		]
	},
	fs: (gl, uniforms, inp, out) => [
		defMain(() => {
			let diffuse: Vec3Sym
			let lightDir: Vec3Sym
			let normal: Vec3Sym
			let distance: FloatSym
			let divisor: FloatSym
			return [
				(normal = sym(normalize(inp.vNormal))),
				(lightDir = sym(sub(uniforms.lightPos, inp.vPos))),
				(distance = sym(length(lightDir))),
				(lightDir = sym(div(lightDir, distance))),
				(divisor = sym(distanceDivisor(distance, vec3(1, 0.01, 0.001)))),
				(diffuse = sym(
					div(
						mul(
							diffuseLighting(
								abs(dot(normal, lightDir)),
								vec3(0.95),
								uniforms.lightColor,
								vec3(0.6),
							),
							spotLight(
								lightDir,
								uniforms.lightDir,
								float(spotLightFactor),
								uniforms.lightColor,
							),
						),
						divisor,
					),
				)),
				assign(out.fragColor, vec4(diffuse, 1.0)),
			]
		}),
	],
})
console.log('objectShader', objectShader)

export const normalDepthPositionShader = defShader({
	attribs: {
		position: 'vec3',
		normal: 'vec3',
	},
	uniforms: {
		viewMat: 'mat4',
		projMat: 'mat4',
		viewNormalMat: 'mat3',
	},
	varying: {
		vViewNormal: 'vec3',
		vViewPos: 'vec3',
		vDepth: 'float',
	},
	outputs: {
		normalDepth: 'vec4',
		position: 'vec4',
	},
	vs(gl, uniforms, inp, out) {
		let pos: Vec4Sym
		return [
			defMain(() => [
				(pos = sym(mul(uniforms.viewMat, vec4(inp.position, 1)))),
				assign(
					gl.gl_Position,
					mul(uniforms.projMat, mul(uniforms.viewMat, vec4(inp.position, 1))),
				),
				assign(out.vViewPos, $xyz(pos)),
				assign(out.vViewNormal, mul(uniforms.viewNormalMat, inp.normal)),
				assign(out.vDepth, $w(gl.gl_Position)),
			]),
		]
	},
	fs: (gl, uniforms, inp, out) => [
		defMain(() => {
			return [
				assign(out.normalDepth, vec4(normalize(inp.vViewNormal), inp.vDepth)),
				assign(out.position, vec4(inp.vViewPos, 1.0)),
			]
		}),
	],
})
console.log('normalDepthPositionShader', normalDepthPositionShader)
