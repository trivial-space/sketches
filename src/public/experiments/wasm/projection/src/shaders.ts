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
	div,
	pow,
	FloatSym,
	length,
	dot,
	abs,
} from '@thi.ng/shader-ast'
import { diffuseLighting, halfLambert } from '@thi.ng/shader-ast-stdlib'
import { defShader } from '../../../../../shared-utils/shaders/ast'
import {
	distanceDivisor,
	specularLight,
	spotLight,
} from '../../../../../shared-utils/shaders/lights'

export const glassLitShader = defShader({
	attribs: {
		position: 'vec3',
		normal: 'vec3',
	},
	uniforms: {
		modelMat: 'mat4',
		cameraMat: 'mat4',
		normalMatrix: 'mat3',
		lightPos: 'vec3',
		lightDir: 'vec3',
		lightColor: 'vec3',
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
			let distance: FloatSym
			let divisor: FloatSym
			return [
				(normal = sym(normalize(inp.vNormal))),
				(lightDir = sym(sub(uniforms.lightPos, inp.vPos))),
				(distance = sym(length(lightDir))),
				(lightDir = sym(div(lightDir, distance))),
				(eyeDir = sym(normalize(sub(uniforms.eyePos, inp.vPos)))),
				(divisor = sym(distanceDivisor(distance, vec3(1, 0.001, 0.0001)))),
				(diffuse = sym(
					div(
						mul(
							diffuseLighting(
								abs(dot(normal, lightDir)),
								uniforms.color,
								uniforms.lightColor,
								div(uniforms.color, 3),
							),
							spotLight(
								lightDir,
								uniforms.lightDir,
								float(20),
								uniforms.lightColor,
							),
						),
						divisor,
					),
				)),
				(specular = sym(
					div(
						specularLight(
							normal,
							lightDir,
							eyeDir,
							pow(uniforms.color, vec3(0.2)),
							float(20),
						),
						divisor,
					),
				)),
				assign(out.fragColor, vec4(add(diffuse, specular), 0.8)),
			]
		}),
	],
})
console.log('glassLitShader', glassLitShader)

export const groundShader = defShader({
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
		lightColor: 'vec3',
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
			let diffuse: Vec3Sym
			let lightDir: Vec3Sym
			let distance: FloatSym
			let divisor: FloatSym
			return [
				(lightDir = sym(sub(uniforms.lightPos, inp.vPos))),
				(distance = sym(length(lightDir))),
				(lightDir = sym(div(lightDir, distance))),
				(divisor = sym(distanceDivisor(distance, vec3(1, 0.001, 0.0001)))),
				(diffuse = sym(
					div(
						mul(
							uniforms.color,
							spotLight(
								lightDir,
								uniforms.lightDir,
								float(20),
								uniforms.lightColor,
							),
						),
						divisor,
					),
				)),
				assign(out.fragColor, vec4(diffuse, 1)),
			]
		}),
	],
})
console.log('groundShader', groundShader)
