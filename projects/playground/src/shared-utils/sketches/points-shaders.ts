import {
	$,
	$w,
	$y,
	assign,
	BoolSym,
	defMain,
	discard,
	div,
	dot,
	eq,
	float,
	FloatSym,
	gt,
	ifThen,
	index,
	indexMat,
	input,
	Mat4Sym,
	mul,
	output,
	program,
	sym,
	ternary,
	uniform,
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
let aColor: Vec4Sym

let uColor: Vec4Sym
let uSize: Vec2Sym
let uPointSize: FloatSym

let vColor: Vec4Sym

export const point2DVert = vs(
	program([
		(aPosition2D = input('vec2', 'position')),
		(aColor = input('vec4', 'color')),
		(uColor = uniform('vec4', 'uColor')),
		(uSize = uniform('vec2', 'uSize')),
		(uPointSize = uniform('float', 'uPointSize')),
		(vColor = output('vec4', 'vColor')),
		defMain(() => [
			assign(vColor, ternary(eq($w(uColor), float(0)), aColor, uColor)),
			assign(vs.gl_PointSize, uPointSize),
			assign(vs.gl_Position, vec4(fit0111(div(aPosition2D, uSize)), 0, 1)),
		]),
	]),
)

let uViewMat: Mat4Sym
let uProjMat: Mat4Sym
let uUseProjection: BoolSym

export const point3DVert = vs(
	program([
		(aPosition3D = input('vec3', 'position')),
		(aColor = input('vec4', 'color')),
		(uColor = uniform('vec4', 'uColor')),
		(uSize = uniform('vec2', 'uSize')),
		(uPointSize = uniform('float', 'uPointSize')),
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
							mul($y(projCol), div(mul(0.5, uPointSize), $w(vs.gl_Position))),
						),
						uPointSize,
					),
				),
			]
		}),
	]),
)

export const pointFrag = fs(
	program([
		(vColor = input('vec4', 'vColor')),
		defMain(() => {
			let pointCoords: Vec2Sym
			return [
				(pointCoords = sym(fit0111(fs.gl_PointCoord))),
				ifThen(
					gt(dot(pointCoords, pointCoords), float(1)),
					[discard],
					[assign(fs.gl_FragColor, vColor)],
				),
			]
		}),
	]),
)
