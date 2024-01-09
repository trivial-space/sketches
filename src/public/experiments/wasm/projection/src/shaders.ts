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
	div,
	pow,
	FloatSym,
	length,
	dot,
	abs,
	BoolSym,
	$w,
	texture,
	$xy,
	and,
	gte,
	FLOAT0,
	$y,
	$x,
	FLOAT1,
	lte,
	ternary,
	VEC3_1,
	Vec2Sym,
	Sampler2DSym,
	program,
	uniform,
	input,
} from '@thi.ng/shader-ast'
import { diffuseLighting } from '@thi.ng/shader-ast-stdlib'
import {
	defShader,
	getFragmentGenerator,
} from '../../../../../shared-utils/shaders/ast'
import {
	distanceDivisor,
	specularLight,
	spotLight,
} from '../../../../../shared-utils/shaders/lights'

const spotLightFactor = 10

export const glassLitShader = defShader({
	attribs: {
		position: 'vec3',
		normal: 'vec3',
	},
	uniforms: {
		modelMat: 'mat4',
		cameraMat: 'mat4',
		normalMat: 'mat3',
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
				assign(out.vNormal, mul(uniforms.normalMat, inp.normal)),
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
				(divisor = sym(distanceDivisor(distance, vec3(1, 0.01, 0.001)))),
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
								float(spotLightFactor),
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

export const glassProjectionShader = defShader({
	attribs: {
		position: 'vec3',
	},
	uniforms: {
		modelMat: 'mat4',
		cameraMat: 'mat4',
		color: 'vec3',
	},
	vs: (gl, uniforms, inp, _out) => {
		let pos: Vec4Sym
		return [
			defMain(() => [
				(pos = sym(mul(uniforms.modelMat, vec4(inp.position, 1)))),
				assign(gl.gl_Position, mul(uniforms.cameraMat, pos)),
			]),
		]
	},
	fs: (gl, uniforms, inp, out) => [
		defMain(() => {
			return [assign(out.fragColor, vec4(uniforms.color, 0.2))]
		}),
	],
})
console.log('glassProjectionShader', glassProjectionShader)

export const groundShader = defShader({
	attribs: {
		position: 'vec3',
		normal: 'vec3',
	},
	uniforms: {
		modelMat: 'mat4',
		cameraMat: 'mat4',
		normalMat: 'mat3',
		textureMat: 'mat4',
		lightDir: 'vec3',
		lightPos: 'vec3',
		lightColor: 'vec3',
		eyePos: 'vec3',
		color: 'vec3',
		projectedTex: 'sampler2D',
	},
	varying: {
		vNormal: 'vec3',
		vPos: 'vec3',
		vProjTexCoords: 'vec4',
	},
	vs: (gl, uniforms, inp, out) => {
		let pos: Vec4Sym
		return [
			defMain(() => [
				(pos = sym(mul(uniforms.modelMat, vec4(inp.position, 1)))),
				assign(out.vPos, $xyz(pos)),
				assign(gl.gl_Position, mul(uniforms.cameraMat, pos)),
				assign(out.vProjTexCoords, mul(uniforms.textureMat, pos)),
				assign(out.vNormal, mul(uniforms.normalMat, inp.normal)),
			]),
		]
	},
	fs: (gl, uniforms, inp, out) => [
		defMain(() => {
			let diffuse: Vec3Sym
			let lightDir: Vec3Sym
			let distance: FloatSym
			let divisor: FloatSym
			let projInRange: BoolSym
			let texCoords: Vec3Sym
			let texColor: Vec4Sym
			return [
				(lightDir = sym(sub(uniforms.lightPos, inp.vPos))),
				(distance = sym(length(lightDir))),
				(lightDir = sym(div(lightDir, distance))),
				(divisor = sym(distanceDivisor(distance, vec3(1, 0.01, 0.001)))),
				(texCoords = sym(
					div($xyz(inp.vProjTexCoords), $w(inp.vProjTexCoords)),
				)),
				(texColor = sym(texture(uniforms.projectedTex, $xy(texCoords)))),
				(projInRange = sym(
					and(
						gte($x(texCoords), FLOAT0),
						and(
							gte($y(texCoords), FLOAT0),
							and(lte($x(texCoords), FLOAT1), lte($y(texCoords), FLOAT1)),
						),
					),
				)),
				(diffuse = sym(
					div(
						mul(
							mul(
								uniforms.color,
								ternary(projInRange, $xyz(pow(texColor, vec4(3))), VEC3_1),
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
				assign(out.fragColor, vec4(diffuse, 1)),
			]
		}),
	],
})
console.log('groundShader', groundShader)

const fs = getFragmentGenerator()
let source: Sampler2DSym
let rand: Sampler2DSym
let vUv: Vec2Sym
let color: Vec4Sym
let noise: Vec4Sym

const colorStep = 1 / 255

export const colorGradeShader = fs(
	program([
		(source = uniform('sampler2D', 'source')),
		(rand = uniform('sampler2D', 'rand')),
		(vUv = input('vec2', 'coords')),
		defMain(() => [
			(color = sym(texture(source, vUv))),
			(noise = sym(texture(rand, vUv))),
			assign(
				fs.gl_FragColor,
				vec4(
					add(
						pow($xyz(color), vec3(0.85)),
						mul(sub($xyz(noise), 0.5), colorStep),
					),
					1.0,
				),
			),
		]),
	]),
)
