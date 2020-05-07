import {
	getFragmentGenerator,
	getVertexGenerator,
} from '../../shared-utils/shaders/ast'
import {
	program,
	defMain,
	assign,
	vec4,
	Mat4Sym,
	Vec3Sym,
	Vec2Sym,
	input,
	uniform,
	output,
	Vec4Sym,
	mul,
	$xyz,
	Sampler2DSym,
	texture,
	div,
	$xy,
	FloatSym,
	sym,
	$y,
	ternary,
	gt,
	sub,
	float,
} from '@thi.ng/shader-ast'

const fs = getFragmentGenerator()
const vs = getVertexGenerator()

// Vertex

let aPosition: Vec3Sym
let uTransform: Mat4Sym
let uProjection: Mat4Sym
let uView: Mat4Sym
export const lineVert = vs(
	// prettier-ignore
	program([
		(aPosition = input('vec3', 'position')),

		(uTransform = uniform('mat4', 'transform')),
		(uProjection = uniform('mat4', 'projection')),
		(uView = uniform('mat4', 'view')),

		defMain(() => [
			assign(vs.gl_Position, mul(mul(mul(uProjection, uView), uTransform), vec4(aPosition, 1))),
		]),
	]),
)

// Fragment

export const lineFrag = fs(
	// prettier-ignore
	program([
		defMain(() => [
			assign(fs.gl_FragColor, vec4(1.0, 0.0, 0.0, 1.0)),
		]),
	]),
)
