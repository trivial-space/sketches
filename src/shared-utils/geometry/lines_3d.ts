import { quat, vec3 } from 'gl-matrix'
import { side } from 'tvs-libs/dist/geometry/primitives'
import {
	Vec,
	mul,
	add,
	cross,
	dot,
	normalize,
	sub,
} from 'tvs-libs/dist/math/vectors'
import {
	flatten,
	reverse,
	repeat,
	concat,
	window,
} from 'tvs-libs/dist/utils/sequence'
import { FormData, FormStoreType } from 'tvs-painter'

export interface LineSegment {
	vertex: Vec
	normal: Vec
	direction: Vec
	length: number
}

export type Line = LineSegment[]

export interface LineStep {
	length: number
	normalAngle?: number
	directionAngle?: number
	tangentAngle?: number
}

export function lineSegment({
	vertex = [0, 0, 0],
	normal = [0, 0, 1],
	direction = [0, 1, 0],
	length = 1,
}: Partial<LineSegment> = {}): LineSegment {
	return { vertex, normal, direction, length }
}

const rotQuatNormal = quat.create()
const rotQuatDirection = quat.create()
const rotQuatTangent = quat.create()
const rotQuat = quat.create()

const vec3Temp = vec3.create()

export function walkLine3D(
	{ length, directionAngle = 0, normalAngle = 0, tangentAngle = 0 }: LineStep,
	segment = lineSegment(),
) {
	if (normalAngle) {
		quat.setAxisAngle(rotQuatNormal, segment.normal as vec3, normalAngle)
	} else {
		quat.identity(rotQuatNormal)
	}
	if (directionAngle) {
		quat.setAxisAngle(
			rotQuatDirection,
			segment.direction as vec3,
			directionAngle,
		)
	} else {
		quat.identity(rotQuatDirection)
	}
	if (tangentAngle) {
		quat.setAxisAngle(
			rotQuatTangent,
			vec3.cross(vec3Temp, segment.direction as vec3, segment.normal as vec3),
			tangentAngle,
		)
	} else {
		quat.identity(rotQuatTangent)
	}
	quat.multiply(
		rotQuat,
		quat.multiply(rotQuat, rotQuatDirection, rotQuatNormal),
		rotQuatTangent,
	)

	const newNormal = vec3.transformQuat(
		vec3.create(),
		segment.normal as vec3,
		rotQuat,
	)

	vec3.normalize(newNormal, newNormal)

	const newDirection = vec3.transformQuat(
		vec3.create(),
		segment.direction as vec3,
		rotQuat,
	)
	vec3.normalize(newDirection, newDirection)

	const newVertex = vec3.create()
	vec3.scale(newVertex, segment.direction as vec3, segment.length)
	vec3.add(newVertex, newVertex, segment.vertex as vec3)

	return lineSegment({
		vertex: newVertex,
		direction: newDirection,
		normal: newNormal,
		length: length,
	})
}

function getSegmentTangent(seg: LineSegment) {
	return seg.direction.length === 2
		? [seg.direction[1], -seg.direction[0]]
		: cross(seg.normal, seg.direction)
}

export function lineSegmentStartPoints(
	thickness: number = 1,
	segment: LineSegment,
) {
	const tangent = getSegmentTangent(segment)
	const p1 = add(mul(thickness, tangent), segment.vertex)
	const p2 = add(mul(-thickness, tangent), segment.vertex)
	return [p1, p2]
}

export function lineSegmentEndPoints(
	thickness: number = 1,
	segment: LineSegment,
) {
	return lineSegmentStartPoints(thickness, {
		...segment,
		vertex: add(segment.vertex, mul(segment.length, segment.direction)),
	})
}

export function splitSharpAngleSegments(
	thickness: number,
	segmentBefore: LineSegment,
	segmentNext: LineSegment,
): Line {
	const cosAngle = dot(segmentBefore.direction, segmentNext.direction)
	if (cosAngle < -0.8) {
		console.log('adding sharp angle segment!')
		const nextTangent = getSegmentTangent(segmentNext)
		const beforeTangent = getSegmentTangent(segmentBefore)
		const tangent = normalize(sub(nextTangent, beforeTangent))

		const dir =
			side(
				[segmentBefore.vertex, segmentNext.vertex],
				add(segmentNext.vertex, segmentNext.direction),
			) >= 0
				? -1
				: 1

		const v1 = add(segmentNext.vertex, mul((dir * -1 * thickness) / 2, tangent))

		return [
			{
				...segmentBefore,
				direction: normalize(sub(v1, segmentBefore.vertex)),
			},
			{
				...segmentNext,
				vertex: v1,
				direction: mul(dir, tangent),
				length: thickness,
			},
			{
				...segmentNext,
				vertex: add(segmentNext.vertex, mul((dir * thickness) / 2, tangent)),
			},
		]
	} else {
		return [segmentBefore, segmentNext]
	}
}

// TODO: add fix for case when points swap in certain situation:
// when join switches between bevel and non-bevel in certain directions.
// See bevel-line test for bug
export function lineSegmentsJoinPoints(
	thickness: number | ((seg: LineSegment) => number) = 1,
	segmentBefore: LineSegment,
	segmentNext: LineSegment,
) {
	// TODO: implement 2 miter points, or 3 bevel points for sharp angles
	// for math see
	// https://mattdesl.svbtle.com/drawing-lines-is-hard
	// https://cesium.com/blog/2013/04/22/robust-polyline-rendering-with-webgl/ "Vertex Shader Details"
	// https://www.npmjs.com/package/polyline-normals

	thickness =
		typeof thickness === 'number'
			? thickness
			: (thickness(segmentBefore) + thickness(segmentNext)) / 2

	const nextTangent = getSegmentTangent(segmentNext)
	const beforeTangent = getSegmentTangent(segmentBefore)
	const tangent = normalize(add(nextTangent, beforeTangent))

	let mitterLenght = thickness / dot(tangent, beforeTangent)
	mitterLenght = Math.min(mitterLenght, thickness * 5)

	const p1 = add(mul(mitterLenght, tangent), segmentNext.vertex)
	const p2 = add(mul(-mitterLenght, tangent), segmentNext.vertex)
	return [p1, p2]
}

// === FormData helpers ===

interface opts {
	withBackFace?: boolean
	withNormals?: boolean
	withUVs?: boolean
	storeType?: FormStoreType
}
export function lineToTriangleStripGeometry(
	line: Line,
	lineWidth: number | ((seg: LineSegment) => number),
	{
		withBackFace = false,
		withNormals = false,
		withUVs = false,
		storeType,
	}: opts = {},
): FormData {
	line = [line[0]].concat(
		window(2, line).flatMap(([before, next]) => {
			const width =
				typeof lineWidth === 'number'
					? lineWidth
					: (lineWidth(before) + lineWidth(next)) / 2
			return splitSharpAngleSegments(width, before, next).slice(1)
		}),
	)

	const lineLength = line.reduce((len, seg) => len + seg.length, 0)

	let points: number[][] = []
	let normals: number[][] = []
	let uvs: number[][] = []
	let currentLength = 0
	for (let i = 0; i < line.length; i++) {
		const cur = line[i]
		const next = line[i + 1]
		const thickness = typeof lineWidth === 'number' ? lineWidth : lineWidth(cur)
		currentLength += cur.length

		if (i === 0) {
			points = lineSegmentStartPoints(thickness, cur)
			normals = [cur.normal, cur.normal] as number[][]
			uvs = [
				[0, 0],
				[1, 0],
			]
		}

		if (next) {
			points = concat(points, lineSegmentsJoinPoints(lineWidth, cur, next))
			const newNormal = normalize(add(cur.normal, next.normal))
			normals = concat(normals, repeat(2, newNormal))
			const uvY = currentLength / lineLength
			uvs.push([0, uvY], [1, uvY])
		} else {
			points = concat(points, lineSegmentEndPoints(thickness, cur))
			normals = concat(normals, [cur.normal, cur.normal] as number[][])
			uvs.push([0, 1], [1, 1])
		}
	}

	if (withBackFace) {
		const backLine = reverse(line)
		currentLength = 0
		for (let i = 0; i < line.length; i++) {
			const cur = backLine[i]
			const next = backLine[i + 1]
			const thickness =
				typeof lineWidth === 'number' ? lineWidth : lineWidth(cur)
			currentLength += cur.length

			if (i === 0) {
				points = concat(points, lineSegmentEndPoints(thickness, cur))
				normals = concat(normals, repeat(2, mul(-1, cur.normal)))
				uvs = uvs.concat([
					[0, 1],
					[1, 1],
				])
			}

			if (next) {
				points = concat(points, lineSegmentsJoinPoints(lineWidth, next, cur))
				const newNormal = mul(-1, normalize(add(cur.normal, next.normal)))
				normals = concat(normals, repeat(2, newNormal))
				const uvY = (lineLength - currentLength) / lineLength
				uvs.push([0, uvY], [1, uvY])
			} else {
				points = concat(points, lineSegmentStartPoints(thickness, cur))
				normals = concat(normals, repeat(2, mul(-1, cur.normal)))
				uvs.push([0, 0], [1, 0])
			}
		}
	}

	const data: FormData = {
		attribs: {
			position: {
				buffer: new Float32Array(flatten(points)),
				storeType,
			},
		},
		drawType: 'TRIANGLE_STRIP',
		itemCount: points.length,
	}

	if (withNormals) {
		data.attribs!.normal = {
			buffer: new Float32Array(flatten(normals)),
			storeType,
		}
	}

	if (withUVs) {
		data.attribs!.uv = {
			buffer: new Float32Array(flatten(uvs)),
			storeType,
		}
	}

	return data
}
