import { partial } from 'tvs-libs/dist/fp/core'
import {
	divideVertical,
	divideHorizontal,
	Quad,
	extrudeBottom,
	triangulate,
} from 'tvs-libs/dist/geometry/quad'
import { flatten } from 'tvs-libs/dist/utils/sequence'
import { convertStackGLGeometry } from 'tvs-painter/dist/utils/stackgl'
import { Vec } from 'tvs-libs/dist/math/vectors'

const vertDiv = partial(divideVertical, 0.5, 0.5)
const horzDiv = partial(divideHorizontal, 0.5, 0.5)

export function subdivide(times = 1, quads: Quad[]): Quad[] {
	for (let i = 0; i < times; i++) {
		quads = flatten(quads.map((q) => flatten(vertDiv(q).map(horzDiv))))
	}
	return quads
}

const uvQuad: Quad = [
	[0, 0],
	[1, 0],
	[1, 1],
	[0, 1],
]

function makeFormData(quad: Quad, normal: Vec, segments: number) {
	const quads = subdivide(segments, [quad])
	const position = flatten(quads)
	return convertStackGLGeometry({
		position,
		normal: position.map(() => normal),
		uv: flatten(subdivide(segments, [uvQuad])),
		cells: triangulate(quads.length),
	})
}

export function makeXYPlane(size: number, segments: number) {
	const normal = [0, 0, -1]
	const quad = extrudeBottom(
		[0, -size * 2, 0],
		[
			[-size, size, 0],
			[size, size, 0],
		],
	)
	const plane = makeFormData(quad, normal, segments)
	console.log(plane, quad)
	return plane
}

export function makeXZPlane(size: number, segments: number) {
	const normal = [0, 1, 0]
	const quad = extrudeBottom(
		[0, 0, -size * 2],
		[
			[-size, 0, size],
			[size, 0, size],
		],
	)
	return makeFormData(quad, normal, segments)
}

export function makeYZPlane(size: number, segments: number) {
	const normal = [1, 0, 0]
	const quad = extrudeBottom(
		[0, -size * 2, 0],
		[
			[0, size, -size],
			[0, size, size],
		],
	)
	return makeFormData(quad, normal, segments)
}
