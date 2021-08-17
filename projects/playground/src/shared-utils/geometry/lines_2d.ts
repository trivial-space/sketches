import { Vec, mul, add, dot, normalize, sub } from 'tvs-libs/dist/math/vectors'
import {
	createDoubleLinkedList,
	DoubleLinkedList,
	DoubleLinkedNode,
} from 'tvs-libs/dist/datastructures/double-linked-list'

type Vec2D = [number, number]
export interface LinePoint {
	vertex: Vec2D
	width?: number
}

export type Line<T extends LinePoint = LinePoint> = DoubleLinkedList<T>
export type LineNode<T extends LinePoint = LinePoint> = DoubleLinkedNode<T>

export function startLine<T extends LinePoint = LinePoint>(point: T): Line<T> {
	return createDoubleLinkedList(point)
}

function getTangent(direction: Vec2D): Vec2D {
	return [direction[1], -direction[0]]
}

function getDirection(v1: Vec2D, v2: Vec2D): Vec2D {
	return normalize(sub(v2, v1)) as Vec2D
}

function linePositions(
	vertex: Vec2D,
	tangent: Vec2D,
	width: number,
): [Vec, Vec] {
	const p1 = add(mul(width, tangent), vertex)
	const p2 = add(mul(-width, tangent), vertex)
	return [p1, p2]
}

export function lineStartPositions(line: Line, thickness?: number): [Vec, Vec] {
	const point = line.first?.val
	const next = line.first?.next?.val
	if (!point || !next) {
		throw 'Line is incomplete'
	}
	const dir = getDirection(point.vertex, next.vertex)
	const tangent = getTangent(dir)
	return linePositions(point.vertex, tangent, point.width || thickness || 1)
}

export function lineEndPositions(line: Line, thickness?: number): [Vec, Vec] {
	const point = line.last?.val
	const prev = line.last?.prev?.val
	if (!point || !prev) {
		throw 'Line is incomplete'
	}
	const dir = getDirection(prev.vertex, point.vertex)
	const tangent = getTangent(dir)
	return linePositions(point.vertex, tangent, point.width || thickness || 1)
}

export function isSharpAngle(node: LineNode): boolean {
	if (!node.prev || !node.next) return false
	const prevDir = getDirection(node.prev.val.vertex, node.val.vertex)
	const nextDir = getDirection(node.val.vertex, node.next.val.vertex)
	const cosAngle = dot(prevDir, nextDir)
	if (cosAngle < -0.8) {
		return true
	}
	return false
}

export function lineSegmentsJoinPoints(node: LineNode, thickness?: number) {
	// TODO: implement 2 miter points, or 3 bevel points for sharp angles
	// for math see
	// https://mattdesl.svbtle.com/drawing-lines-is-hard
	// https://cesium.com/blog/2013/04/22/robust-polyline-rendering-with-webgl/ "Vertex Shader Details"
	// https://www.npmjs.com/package/polyline-normals
	//
	if (!node.prev && !node.next) {
		throw 'incomplete Line'
	}
	const point = node.val
	if (!node.prev) {
		const dir = getDirection(point.vertex, node.next!.val.vertex)
		const tangent = getTangent(dir)
		return linePositions(point.vertex, tangent, point.width || thickness || 1)
	}
	if (!node.next) {
		const dir = getDirection(node.prev.val.vertex, point.vertex)
		const tangent = getTangent(dir)
		return linePositions(point.vertex, tangent, point.width || thickness || 1)
	}

	thickness = node.val.width || thickness || 1
	const prevDir = getDirection(node.prev.val.vertex, node.val.vertex)
	const nextDir = getDirection(node.val.vertex, node.next.val.vertex)
	const tangent = normalize(sub(prevDir, nextDir))
	let mitterLenght = thickness / dot(tangent, prevDir)
	mitterLenght = Math.min(mitterLenght, thickness * 5)
	return linePositions(node.val.vertex, tangent as Vec2D, mitterLenght)
}
