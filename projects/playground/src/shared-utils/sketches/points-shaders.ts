import {
	assign,
	defMain,
	div,
	FloatSym,
	input,
	output,
	program,
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

let uSize: Vec2Sym
let uPointSize: FloatSym

let vColor: Vec4Sym

export const point2DVert = vs(
	program([
		(aPosition2D = input('vec2', 'position')),
		(aColor = input('vec4', 'color')),
		(uSize = uniform('vec2', 'size')),
		(uPointSize = uniform('float', 'pointSize')),
		(vColor = output('vec4', 'vColor')),
		defMain(() => [
			assign(vColor, aColor),
			assign(vs.gl_PointSize, uPointSize),
			assign(vs.gl_Position, vec4(fit0111(div(aPosition2D, uSize)), 0, 1)),
		]),
	]),
)

export const pointFrag = fs(
	program([
		(vColor = input('vec4', 'vColor')),
		defMain(() => [assign(fs.gl_FragColor, vColor)]),
	]),
)
