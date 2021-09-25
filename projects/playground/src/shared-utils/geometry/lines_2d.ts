import {
	mul,
	add,
	dot,
	normalize,
	sub,
	length,
	div,
} from 'tvs-libs/dist/math/vectors'
import {
	createDoubleLinkedList,
	DoubleLinkedNode,
} from 'tvs-libs/dist/datastructures/double-linked-list'
import { Maybe, Opt } from 'tvs-libs/dist/types'
import { FormData, FormStoreType } from 'tvs-painter'
import { flatten } from 'tvs-libs/dist/utils/sequence'

type Vec2D = [number, number]
export interface LinePoint {
	vertex: Vec2D
	width?: number
	length: number
	direction: Vec2D
}

export type LineNode<T extends LinePoint = LinePoint> = DoubleLinkedNode<T>
export interface Line<T extends LinePoint = LinePoint> extends Iterable<T> {
	readonly first: Opt<LineNode<T>>
	readonly last: Opt<LineNode<T>>
	readonly size: number

	at(n: number): Opt<LineNode<T>>

	append(val: T, recalculate?: boolean): Line<T>
	appendAt(node: LineNode<T>, val: T, recalculate?: boolean): Line<T>
	prepend(val: T, recalculate?: boolean): Line<T>
	prependAt(node: LineNode<T>, val: T, recalculate?: boolean): Line<T>

	readonly reverted: Iterable<T>
	readonly nodes: Iterable<LineNode<T>>
	readonly nodesReverted: Iterable<LineNode<T>>

	drop(n?: number): Line<T>
	dropAt(node: LineNode<T>, n?: number): Line<T>

	empty(): Line<T>

	nodesFrom(node: Opt<LineNode<T>>): Iterable<LineNode<T>>
	nodesRevertedFrom(node: Opt<LineNode<T>>): Iterable<LineNode<T>>
}

export function newLinePoint(vertex: Vec2D, width?: number): LinePoint {
	return { direction: [0, 0], length: 0, vertex, width }
}

function updatePoint(point: Maybe<LinePoint>, nextPoint: Maybe<LinePoint>) {
	if (point && nextPoint) {
		const dir = sub(nextPoint.vertex, point.vertex)
		const len = length(dir)
		point.length = len
		point.direction = div(len, dir, dir) as Vec2D
	}
}

export function startLine<P extends LinePoint = LinePoint>(point: P): Line<P> {
	const baseList = createDoubleLinkedList(point)

	const list: Line<P> = {
		...baseList,
		get first() {
			return baseList.first
		},
		get last() {
			return baseList.last
		},
		get size() {
			return baseList.size
		},
		drop(n) {
			baseList.drop(n)
			return list
		},
		dropAt(node, n) {
			baseList.dropAt(node, n)
			return list
		},
		empty() {
			baseList.empty()
			return list
		},
		append(val, recalculate = true) {
			baseList.append(val)
			if (recalculate) {
				updatePoint(baseList.last?.prev?.val, val)
			}
			return list
		},
		appendAt(node, val, recalculate = true) {
			baseList.appendAt(node, val)
			if (recalculate) {
				updatePoint(node.val, val)
				updatePoint(val, node.next?.next?.val)
			}
			return list
		},
		prepend(val, recalculate = true) {
			baseList.prepend(val)
			if (recalculate) {
				updatePoint(val, baseList.first?.next?.val)
			}
			return list
		},
		prependAt(node, val, recalculate = true) {
			baseList.prependAt(node, val)
			if (recalculate) {
				updatePoint(val, node.val)
				updatePoint(node.prev?.prev?.val, val)
			}
			return list
		},
	}
	return list
}

function getTangent(direction: Vec2D): Vec2D {
	return [direction[1], -direction[0]]
}

function linePositions(
	vertex: Vec2D,
	tangent: Vec2D,
	width: number,
): [Vec2D, Vec2D] {
	const p1 = add(mul(width, tangent), vertex) as Vec2D
	const p2 = add(mul(-width, tangent), vertex) as Vec2D
	return [p1, p2]
}

export function lineStartPositions(
	line: Line,
	thickness?: number,
): [Vec2D, Vec2D] {
	const point = line.first?.val
	const next = line.first?.next?.val
	if (!point || !next) {
		throw 'Line is incomplete'
	}
	const tangent = getTangent(point.direction)
	return linePositions(point.vertex, tangent, point.width || thickness || 1)
}

export function lineEndPositions(
	line: Line,
	thickness?: number,
): [Vec2D, Vec2D] {
	const point = line.last?.val
	const prev = line.last?.prev?.val
	if (!point || !prev) {
		throw 'Line is incomplete'
	}
	const tangent = getTangent(prev.direction)
	return linePositions(point.vertex, tangent, point.width || thickness || 1)
}

export function isSharpAngle(node: LineNode): boolean {
	if (!node.prev || !node.next) return false
	const cosAngle = dot(node.prev.val.direction, node.val.direction)
	if (cosAngle < -0.85) {
		return true
	}
	return false
}

export function lineJoinPositions(node: LineNode, thickness?: number) {
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
		const tangent = getTangent(point.direction)
		return linePositions(point.vertex, tangent, point.width || thickness || 1)
	}
	if (!node.next) {
		const tangent = getTangent(node.prev.val.direction)
		return linePositions(point.vertex, tangent, point.width || thickness || 1)
	}

	thickness = node.val.width || thickness || 1
	const nextTangent = getTangent(node.val.direction)
	const prevTangent = getTangent(node.prev.val.direction)
	const tangent = normalize(add(nextTangent, prevTangent))
	let mitterLenght = thickness / dot(tangent, prevTangent)
	mitterLenght = Math.min(mitterLenght, thickness * 5)
	return linePositions(node.val.vertex, tangent as Vec2D, mitterLenght)
}

// === FormData helpers ===

export function lineToTriangleStripGeometry(
	lineData: Line,
	lineWidth?: number,
	storeType?: FormStoreType,
): FormData[] {
	if (lineData.size < 2) {
		return [{ attribs: {}, itemCount: 0 }]
	}

	const lines: Line[] = []
	let lineLength = 0
	let currentLine: Line = startLine(lineData.first!.val)
	for (const node of lineData.nodes) {
		lineLength += node.val.length
		if (node === lineData.first) continue
		if (isSharpAngle(node)) {
			currentLine.append(newLinePoint(node.val.vertex, node.val.width), false)
			lines.push(currentLine)
			currentLine = startLine(node.val)
		} else {
			currentLine.append(node.val, false)
		}
	}
	lines.push(currentLine)

	let currentLength = 0
	let swap = false
	return lines.map((line) => {
		swap = !swap
		let points: Vec2D[] = []
		let uvs: Vec2D[] = []
		let curr = line.first
		while (curr) {
			const uvY = currentLength / lineLength
			uvs.push([swap ? 0 : 1, uvY], [swap ? 1 : 0, uvY])
			points.push(...lineJoinPositions(curr, lineWidth))

			if (curr.next) {
				currentLength += curr.val.length
			}

			curr = curr.next
		}

		const data: FormData = {
			attribs: {
				position: {
					buffer: new Float32Array(flatten(points)),
					storeType,
				},
				uv: {
					buffer: new Float32Array(flatten(uvs)),
					storeType,
				},
			},
			drawType: 'TRIANGLE_STRIP',
			itemCount: points.length,
		}

		return data
	})
}
