import {
	mul,
	add,
	dot,
	normalize,
	sub,
	length,
	div,
	cross2D,
} from 'tvs-libs/dist/math/vectors'
import {
	createDoubleLinkedList,
	DoubleLinkedList,
	DoubleLinkedNode,
	LinkedListOptions,
} from 'tvs-libs/dist/datastructures/double-linked-list'
import { Maybe } from 'tvs-libs/dist/types'
import { FormData, FormStoreType } from 'tvs-painter'
import { doTimes, flatten, zip } from 'tvs-libs/dist/utils/sequence'
import { lerp } from 'tvs-libs/dist/math/core'
import { partial } from 'tvs-libs/dist/fp/core'

type Vec2D = [number, number]
export interface LinePoint {
	vertex: Vec2D
	width?: number
	length: number
	direction: Vec2D
}

export type LineNode<T extends LinePoint = LinePoint> = DoubleLinkedNode<T>
export type Line<T extends LinePoint = LinePoint> = DoubleLinkedList<T>

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
	return point
}

export function smouthenPoint<P extends LinePoint>(
	node: Maybe<DoubleLinkedNode<P>>,
	{
		ratio = 0.25,
		minLength = 3,
		depth = 1,
		recalculate = true,
		interPolate = ['width'] as Array<keyof P>,
	} = {},
) {
	if (
		node &&
		node.prev &&
		node.next &&
		node.prev.val.length > minLength &&
		node.val.length > minLength
	) {
		// console.log('smouthening point', node.val)
		const prev = node.prev

		const lerp1 = partial(lerp, 1 - ratio)
		const newPrevPoint = newLinePoint(
			zip(lerp1, node.prev.val.vertex, node.val.vertex) as Vec2D,
		) as P
		for (const key of interPolate) {
			const prevVal = node.prev.val[key]
			const nodeVal = node.val[key]
			if (typeof nodeVal === 'number' && typeof prevVal === 'number') {
				newPrevPoint[key] = lerp1(prevVal, nodeVal) as any
			}
			if (Array.isArray(nodeVal) && Array.isArray(prevVal)) {
				newPrevPoint[key] = zip(lerp1, prevVal, nodeVal) as any
			}
		}
		node.list.prependAt(node, newPrevPoint, recalculate)

		prev.set(prev.val, recalculate)

		const lerp2 = partial(lerp, ratio)
		const newNodePoint = newLinePoint(
			zip(lerp2, node.val.vertex, node.next.val.vertex) as Vec2D,
		) as P
		for (const key of interPolate) {
			const nodeVal = node.val[key]
			const nextVal = node.next.val[key]
			if (typeof nodeVal === 'number' && typeof nextVal === 'number') {
				newNodePoint[key] = lerp2(nodeVal, nextVal) as any
			}
			if (Array.isArray(nodeVal) && Array.isArray(nextVal)) {
				newNodePoint[key] = zip(lerp2, nodeVal, nextVal) as any
			}
		}
		node.set(newNodePoint, recalculate)

		node.next.set(node.next.val, recalculate)

		if (depth > 1) {
			smouthenPoint(node.prev, {
				ratio,
				minLength,
				depth: depth - 1,
				recalculate,
				interPolate,
			})
			smouthenPoint(node, {
				ratio,
				minLength,
				depth: depth - 1,
				recalculate,
				interPolate,
			})
		}
	}
}

export function createLine<P extends LinePoint = LinePoint>(
	opts?: LinkedListOptions<P>,
): Line<P> {
	return createDoubleLinkedList<P>([], {
		onNextUpdated: (n) => {
			updatePoint(n.val, n.next && n.next.val)
			opts?.onNextUpdated?.(n)
		},
		onPrevUpdated: opts?.onPrevUpdated,
	})
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

export function isSharpAngle(node: LineNode): boolean {
	if (!node.prev || !node.next) return false
	const cosAngle = dot(node.prev.val.direction, node.val.direction)
	if (cosAngle < -0.5) {
		return true
	}
	return false
}

export function lineMitterPositions(node: LineNode, thickness?: number) {
	// for math see
	// https://mattdesl.svbtle.com/drawing-lines-is-hard
	// https://cesium.com/blog/2013/04/22/robust-polyline-rendering-with-webgl/ "Vertex Shader Details"
	// https://www.npmjs.com/package/polyline-normals
	//
	if (!node.prev && !node.next) {
		throw 'incomplete Line'
	}
	const point = node.val
	thickness = point.width || thickness || 1
	if (!node.prev) {
		const tangent = getTangent(point.direction)
		return linePositions(point.vertex, tangent, thickness)
	}
	if (!node.next) {
		const tangent = getTangent(node.prev.val.direction)
		return linePositions(point.vertex, tangent, thickness)
	}

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
	let currentLine: Line = createLine()
	for (const node of lineData.nodes) {
		lineLength += node.val.length
		if (isSharpAngle(node)) {
			currentLine.append({
				vertex: node.val.vertex,
				width: node.val.width,
				direction: node.prev!.val.direction,
				length: 0,
			})
			lines.push(currentLine)
			currentLine = createLine()
		}
		currentLine.append(node.val)
	}
	lines.push(currentLine)

	let currentLength = 0
	let swap = false
	return lines.map((line) => {
		swap = !swap
		let points: Vec2D[] = []
		let uvs: Vec2D[] = []

		for (const curr of line.nodes) {
			const uvY = currentLength / lineLength
			uvs.push([swap ? 0 : 1, uvY], [swap ? 1 : 0, uvY])
			points.push(...lineMitterPositions(curr, lineWidth))

			if (curr.next) {
				currentLength += curr.val.length
			}
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

type LineAttributes = LinePoint & {
	currentLength: number
	uv: [number, number]
	width: number
}
export function lineToSmouthTriangleStripGeometry(
	lineData: Line,
	lineWidth?: number,
	storeType: FormStoreType = 'STATIC',
): FormData[] {
	if (lineData.size < 2) {
		return [{ attribs: {}, itemCount: 0 }]
	}

	const lines: Line[] = []
	let lineLength = 0
	let currentLine: Line = createLine()
	for (const node of lineData.nodes) {
		lineLength += node.val.length
		if (isSharpAngle(node)) {
			currentLine.append({
				vertex: node.val.vertex,
				width: node.val.width,
				direction: node.prev!.val.direction,
				length: 0,
			})
			lines.push(currentLine)
			currentLine = createLine()
		}
		currentLine.append(node.val)
	}
	lines.push(currentLine)

	let currentLength = 0
	let swap = false
	let prev: DoubleLinkedNode<LinePoint> | null = null
	let prevPoints: [Vec2D, Vec2D] | null = null
	const data = lines.map((line) => {
		swap = !swap

		let uvY = currentLength / lineLength

		const topLine: Line<LineAttributes> = createLine()
		const bottomLine: Line<LineAttributes> = createLine()

		topLine.append({
			...line.first!.val,
			uv: [0.5, uvY],
			currentLength,
			width: 0,
		})
		bottomLine.append({
			...line.first!.val,
			uv: [0.5, uvY],
			currentLength,
			width: 0,
		})

		for (const curr of line.nodes) {
			uvY = currentLength / lineLength
			const width = curr.val.width || lineWidth || 1
			const newPoints = lineMitterPositions(curr, lineWidth)

			if (curr === line.first && prev && prevPoints) {
				adjustEdgePoints(newPoints, prevPoints, curr, prev, lineWidth)
			}

			topLine.append({
				...curr.val,
				vertex: newPoints[0],
				uv: [swap ? 0 : 1, uvY],
				currentLength,
				width,
			})
			bottomLine.append({
				...curr.val,
				vertex: newPoints[1],
				uv: [swap ? 1 : 0, uvY],
				currentLength,
				width,
			})

			if (curr.next) {
				currentLength += curr.val.length
			}

			prev = curr
			prevPoints = newPoints
		}

		topLine.append({
			...line.last!.val,
			uv: [0.5, uvY],
			currentLength,
			width: 0,
		})
		bottomLine.append({
			...line.last!.val,
			uv: [0.5, uvY],
			currentLength,
			width: 0,
		})

		return { bottomLine, topLine }
	})

	return data.map(({ topLine, bottomLine }) => {
		doTimes(() => {
			for (const node of topLine.nodes) {
				smouthenPoint(node, {
					minLength: -1,
					interPolate: ['currentLength', 'direction', 'length', 'uv', 'width'],
				})
			}
			for (const node of bottomLine.nodes) {
				smouthenPoint(node, {
					minLength: -1,
					interPolate: ['currentLength', 'direction', 'length', 'uv', 'width'],
				})
			}
		}, 4)

		const points: Vec2D[] = []
		const uvs: Vec2D[] = []

		let top = topLine.first
		let bottom = bottomLine.first

		while (top && bottom) {
			points.push(top.val.vertex, bottom.val.vertex)
			uvs.push(top.val.uv, bottom.val.uv)
			top = top.next
			bottom = bottom.next
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

function adjustEdgePoints(
	newPoints: [Vec2D, Vec2D],
	prevPoints: [Vec2D, Vec2D],
	curr: DoubleLinkedNode<LinePoint>,
	prev: DoubleLinkedNode<LinePoint>,
	lineWidth?: number,
) {
	const width = curr.val.width || lineWidth || 1
	const c =
		width /
		dot(
			normalize(add(mul(-1, prev.val.direction), curr.val.direction)),
			curr.val.direction,
		)
	const a = Math.sqrt(c * c - width * width)
	if (a > 0.001) {
		if (cross2D(curr.val.direction, prev.val.direction) > 0) {
			add(newPoints[0], mul(-a, curr.val.direction), newPoints[0])
			add(newPoints[1], mul(a, curr.val.direction), newPoints[1])
			add(prevPoints[0], mul(a, prev.val.direction), prevPoints[0])
			add(prevPoints[1], mul(-a, prev.val.direction), prevPoints[1])
		} else {
			add(newPoints[0], mul(a, curr.val.direction), newPoints[0])
			add(newPoints[1], mul(-a, curr.val.direction), newPoints[1])
			add(prevPoints[0], mul(-a, prev.val.direction), prevPoints[0])
			add(prevPoints[1], mul(a, prev.val.direction), prevPoints[1])
		}
	}
}
