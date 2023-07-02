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

Q.painter.updateDrawSettings({
	enable: [Q.gl.DEPTH_TEST],
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
						vec3(1, 0.5, 1),
						vec3(1, 1, 1),
						vec3(0.1, 0, 0),
					),
					1,
				),
			),
		]),
	],
})

const form = Q.getForm('ball')
const shade = Q.getShade('ball').update(shader)
const sketch = Q.getSketch('ball').update({
	form,
	shade,
})

export function renderInit(geometry: FormData) {
	form.update(geometry)
}

export function render(
	camera: Float32Array,
	normalMatrix: Float32Array,
	light: Float32Array,
) {
	Q.painter.draw({
		sketches: sketch,
		uniforms: { camera, light, normalMatrix },
	})
}
