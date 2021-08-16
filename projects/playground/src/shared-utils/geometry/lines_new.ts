import {
	Vec,
	mul,
	add,
	cross,
	dot,
	normalize,
	sub,
} from 'tvs-libs/dist/math/vectors'
import { quat, vec3 } from 'gl-matrix'
import {
	flatten,
	reverse,
	repeat,
	concat,
	window,
} from 'tvs-libs/dist/utils/sequence'
import { FormData, FormStoreType } from 'tvs-painter'
import { side } from 'tvs-libs/dist/geometry/primitives'
import {
	createDoubleLinkedList,
	DoubleLinkedList,
	DoubleLinkedNode,
} from 'tvs-libs/dist/datastructures/double-linked-list'

export interface LinePoint {
	vertex: Vec
	normal?: Vec
	width?: number
}

export interface LinePoint3D extends LinePoint {
	normal: Vec
}

export type Line<T extends LinePoint = LinePoint> = DoubleLinkedList<T>
export type LineNode<T extends LinePoint = LinePoint> = DoubleLinkedNode<T>

export interface LineStep {
	length: number
	normalAngle?: number
	directionAngle?: number
	tangentAngle?: number
	nextWidth?: number
}

export function startLine<T extends LinePoint = LinePoint>(point: T): Line<T> {
	return createDoubleLinkedList(point)
}

const rotQuatNormal = quat.create()
const rotQuatDirection = quat.create()
const rotQuatTangent = quat.create()
const rotQuat = quat.create()

const vec3Temp = vec3.create()

export function walkLine3D(
	{
		length,
		directionAngle = 0,
		normalAngle = 0,
		tangentAngle = 0,
		nextWidth,
	}: LineStep,
	line: Line<LinePoint3D> = startLine({ vertex: [0, 0, 0], normal: [0, 0, 1] }),
): Line<LinePoint3D> {
	const v = line.last!.val
	if (normalAngle) {
		quat.setAxisAngle(rotQuatNormal, v.normal as vec3, normalAngle)
	} else {
		quat.identity(rotQuatNormal)
	}
	const prev = line.last?.prev?.val
	const direction = prev ? sub(v.vertex, prev.vertex) : [0, 1, 0]
	if (directionAngle) {
		quat.setAxisAngle(rotQuatDirection, direction as vec3, directionAngle)
	} else {
		quat.identity(rotQuatDirection)
	}
	if (tangentAngle) {
		quat.setAxisAngle(
			rotQuatTangent,
			vec3.cross(vec3Temp, direction as vec3, v.normal as vec3),
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

	const newNormal = vec3.transformQuat(vec3.create(), v.normal as vec3, rotQuat)

	vec3.normalize(newNormal, newNormal)

	const newDirection = vec3.transformQuat(
		vec3.create(),
		direction as vec3,
		rotQuat,
	)
	vec3.normalize(newDirection, newDirection)

	const newVertex = vec3.create()
	vec3.scale(newVertex, newDirection, length)
	vec3.add(newVertex, newVertex, v.vertex as vec3)

	return line.append({ vertex: newVertex, normal: newNormal, width: nextWidth })
}

function getTangent(direction: Vec, normal?: Vec) {
	return direction.length === 3 && normal
		? cross(normal, direction)
		: [direction[1], -direction[0]]
}

function getDirection(v1: Vec, v2: Vec) {
	return normalize(sub(v2, v1))
}

function createLinePositions(
	node: LinePoint,
	tangent: Vec,
	thickness?: number,
): [Vec, Vec] {
	const width = node.width || thickness || 1
	const p1 = add(mul(width, tangent), node.vertex)
	const p2 = add(mul(-width, tangent), node.vertex)
	return [p1, p2]
}

export function lineStartPositions(line: Line, thickness?: number): [Vec, Vec] {
	const node = line.first?.val
	const next = line.first?.next?.val
	if (!node || !next) {
		throw 'Line is incomplete'
	}
	const dir = getDirection(node.vertex, next.vertex)
	const tangent = getTangent(dir, node.normal)
	return createLinePositions(node, tangent, thickness)
}

export function lineEndPositions(line: Line, thickness?: number): [Vec, Vec] {
	const node = line.last?.val
	const prev = line.last?.prev?.val
	if (!node || !prev) {
		throw 'Line is incomplete'
	}
	const dir = getDirection(prev.vertex, node.vertex)
	const tangent = getTangent(dir, node.normal)
	return createLinePositions(node, tangent, thickness)
}

export function splitSharpAngleLinePoint(
	node: LineNode,
	thickness?: number,
): void {
	if (!node.prev || !node.next) return
	const prevDir = getDirection(node.prev.val.vertex, node.val.vertex)
	const nextDir = getDirection(node.val.vertex, node.next.val.vertex)
	const cosAngle = dot(prevDir, nextDir)
	if (cosAngle < -0.8) {
		console.log('adding sharp angle segment!')
		// TODO: Handle sharp angles
	}
}

export function lineSegmentsJoinPoints(node: LinePoint, thickness = 1) {
	// TODO: implement 2 miter points, or 3 bevel points for sharp angles
	// for math see
	// https://mattdesl.svbtle.com/drawing-lines-is-hard
	// https://cesium.com/blog/2013/04/22/robust-polyline-rendering-with-webgl/ "Vertex Shader Details"
	// https://www.npmjs.com/package/polyline-normals
	//
	// const nextTangent = getTangent(segmentNext)
	// const beforeTangent = getTangent(segmentBefore)
	// const tangent = normalize(add(nextTangent, beforeTangent))
	// let mitterLenght = thickness / dot(tangent, beforeTangent)
	// mitterLenght = Math.min(mitterLenght, thickness * 5)
	// const p1 = add(mul(mitterLenght, tangent), segmentNext.vertex)
	// const p2 = add(mul(-mitterLenght, tangent), segmentNext.vertex)
	// return [p1, p2]
}
