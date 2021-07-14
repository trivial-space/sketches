import {
	$w,
	$x,
	$y,
	add,
	assign,
	BoolSym,
	defMain,
	div,
	eq,
	float,
	FloatSym,
	indexMat,
	input,
	IntSym,
	Mat4Sym,
	mul,
	normalize,
	output,
	program,
	sub,
	sym,
	ternary,
	uniform,
	vec2,
	Vec2Sym,
	Vec3Sym,
	vec4,
	Vec4Sym,
} from '@thi.ng/shader-ast'
import { fit0111 } from '@thi.ng/shader-ast-stdlib'
import { getFragmentGenerator, getVertexGenerator } from '../shaders/ast'

const vs = getVertexGenerator()
const fs = getFragmentGenerator()

// === 2D Points ===

let aPosition2D: Vec2Sym
let aPosition3D: Vec3Sym
let aPrev2D: Vec2Sym
let aPrev3D: Vec3Sym
let aDirection: FloatSym
let aColor: Vec4Sym

let uColor: Vec4Sym
let uSize: Vec2Sym
let uLinieWidth: FloatSym

let vColor: Vec4Sym

export const line2DVert = vs(
	program([
		(aPosition2D = input('vec2', 'position')),
		(aPrev2D = input('vec2', 'prev')),
		(aDirection = input('float', 'direction')),
		(aColor = input('vec4', 'color')),
		(uColor = uniform('vec4', 'uColor')),
		(uSize = uniform('vec2', 'uSize')),
		(uLinieWidth = uniform('float', 'uLineWidth')),
		(vColor = output('vec4', 'vColor')),
		defMain(() => {
			let diff: Vec2Sym
			let normal: Vec2Sym
			let width: FloatSym
			return [
				(width = sym(mul(div(uLinieWidth, 2), float(aDirection)))),
				(diff = sym(normalize(sub(aPosition2D, aPrev2D)))),
				(normal = sym(vec2($y(diff), mul(-1, $x(diff))))),
				assign(
					vs.gl_Position,
					vec4(fit0111(div(add(aPosition2D, mul(normal, width)), uSize)), 0, 1),
				),
				assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor)),
			]
		}),
	]),
)

let uViewMat: Mat4Sym
let uProjMat: Mat4Sym
let uUseProjection: BoolSym

export const line3DVert = vs(
	program([
		(aPosition3D = input('vec3', 'position')),
		(aColor = input('vec4', 'color')),
		(uColor = uniform('vec4', 'uColor')),
		(uSize = uniform('vec2', 'uSize')),
		(uLinieWidth = uniform('float', 'uPointSize')),
		(uViewMat = uniform('mat4', 'uViewMat')),
		(uProjMat = uniform('mat4', 'uProjectionMat')),
		(uUseProjection = uniform('bool', 'uUseProjection')),
		(vColor = output('vec4', 'vColor')),
		defMain(() => {
			let projCol: Vec4Sym
			return [
				assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor)),
				(projCol = sym(indexMat(uProjMat, 1))),
				assign(
					vs.gl_Position,
					mul(uProjMat, mul(uViewMat, vec4(aPosition3D, 1))),
				),
				//vpSize.y * projectionMat[1][1] * 1.0 / gl_Position.w
				assign(
					vs.gl_PointSize,
					ternary(
						uUseProjection,
						mul(
							$y(uSize),
							mul($y(projCol), div(mul(0.5, uLinieWidth), $w(vs.gl_Position))),
						),
						uLinieWidth,
					),
				),
			]
		}),
	]),
)

export const lineFrag = fs(
	program([
		(vColor = input('vec4', 'vColor')),
		defMain(() => {
			return [assign(fs.gl_FragColor, vColor)]
		}),
	]),
)
