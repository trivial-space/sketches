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
	div,
	FloatSym,
	length,
	dot,
	abs,
	$w,
	index,
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
		cameraMat: 'mat4',
		lightPos: 'vec3',
		lightDir: 'vec3',
		lightColor: 'vec3',
		eyePos: 'vec3',
	},
	varying: {
		vNormal: 'vec3',
		vPos: 'vec3',
		vDepth: 'float',
	},
	outputs: {
		color: 'vec4',
		normalDepth: 'vec4',
	},
	vs(gl, uniforms, inp, out) {
		let pos: Vec4Sym
		return [
			defMain(() => [
				(pos = sym(vec4(inp.position, 1))),
				assign(out.vPos, $xyz(pos)),
				assign(gl.gl_Position, mul(uniforms.cameraMat, pos)),
				assign(out.vNormal, inp.normal),
				assign(out.vDepth, $w(gl.gl_Position)),
			]),
		]
	},
	fs: (gl, uniforms, inp, out) => [
		defMain(() => {
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
				(divisor = sym(distanceDivisor(distance, vec3(1, 0.01, 0.001)))),
				(diffuse = sym(
					div(
						mul(
							diffuseLighting(
								abs(dot(normal, lightDir)),
								vec3(0.95),
								uniforms.lightColor,
								div(vec3(0.95), 3),
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
				// assign(index(gl.gl_FragData, 0), vec4(diffuse, 1.0)),
				// assign(index(gl.gl_FragData, 1), vec4(inp.vNormal, inp.vDepth)),
				assign(out.color, vec4(diffuse, 1.0)),
				assign(out.normalDepth, vec4(inp.vNormal, inp.vDepth)),
			]
		}),
	],
})
console.log('objectShader', objectShader)
