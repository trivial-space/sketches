import { Vec, mul, add, cross } from 'tvs-libs/dist/math/vectors'
import { quat, vec3 } from 'gl-matrix'

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
export function walkLine(
	{ length, directionAngle = 0, normalAngle = 0, tangentAngle = 0 }: LineStep,
	segment = lineSegment(),
) {
	quat.setAxisAngle(rotQuatNormal, segment.normal as vec3, normalAngle)
	quat.setAxisAngle(rotQuatDirection, segment.direction as vec3, directionAngle)
	quat.setAxisAngle(
		rotQuatTangent,
		vec3.cross(vec3Temp, segment.direction as vec3, segment.normal as vec3),
		tangentAngle,
	)
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

export function lineSegmentToPoints(
	thickness: number = 1,
	segment: LineSegment,
) {
	const tangent = cross(segment.normal, segment.direction)
	const p1 = add(mul(-thickness, tangent), segment.vertex)
	const p2 = add(mul(thickness, tangent), segment.vertex)
	return [p1, p2]
}
