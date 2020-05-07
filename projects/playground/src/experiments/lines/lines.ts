import { Vec, dot, mul, add, cross } from 'tvs-libs/dist/math/vectors'
import { quat, mat3, vec3 } from 'gl-matrix'
import { sphereToCartesian3D, sphereCoord } from 'tvs-libs/dist/math/coords'

export interface LineSegment {
	vertex: Vec
	normal: Vec
	direction: Vec
	length: number
}

export type Line = LineSegment[]

export interface LineStep {
	length: number
	polarAngleY: number
	azimuthAngleZ: number
}

export function lineSegment({
	vertex = [0, 0, 0],
	normal = [-1, 0, 0],
	direction = [0, 1, 0],
	length = 1,
}: Partial<LineSegment> = {}): LineSegment {
	return { vertex, normal, direction, length }
}

const rotQuatDelta = quat.create()
const rotQuatNormal = quat.create()
const rotQuatDirection = quat.create()
const rotQuat = quat.create()
const standardDirection = sphereToCartesian3D(sphereCoord(1, 0, 0))

export function walkLine(step: LineStep, segment = lineSegment()) {
	const requestedDirection = sphereToCartesian3D(
		sphereCoord(1, step.polarAngleY, step.azimuthAngleZ),
	)
	quat.rotationTo(rotQuatDelta, standardDirection, requestedDirection)
	// quat.rotationTo(rotQuatNormal, segment.normal, segment.direction)
	// quat.multiply(rotQuatDirection, rotQuatDelta, rotQuatNormal)

	const newNormal = vec3.transformQuat(
		vec3.create(),
		segment.normal as vec3,
		rotQuatDelta,
	)

	vec3.normalize(newNormal, newNormal)

	const newDirection = vec3.transformQuat(
		vec3.create(),
		segment.direction as vec3,
		rotQuatDelta,
	)
	vec3.normalize(newDirection, newDirection)

	const newVertex = vec3.create()
	vec3.scale(newVertex, segment.direction as vec3, segment.length)
	vec3.add(newVertex, newVertex, segment.vertex as vec3)

	return lineSegment({
		vertex: newVertex,
		direction: newDirection,
		normal: newNormal,
		length: step.length,
	})
}

export function lineSegmentToPoints(
	thickness: number = 1,
	segment: LineSegment,
) {
	const tangent = cross(segment.normal, segment.direction)
	const p1 = add(mul(thickness, tangent), segment.vertex)
	const p2 = add(mul(-thickness, tangent), segment.vertex)
	return [p1, p2]
}
