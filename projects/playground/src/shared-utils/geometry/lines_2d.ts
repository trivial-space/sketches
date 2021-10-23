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
import { flatten, zip } from 'tvs-libs/dist/utils/sequence'
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
			node.val.width &&
				node.next.val.width &&
				lerp2(node.val.width, node.next.val.width),
		)
		node.set(updatePoint(newNodePoint, node.next.val) as P, recalculate)

		node.next.set(node.next.val, recalculate)

		if (depth > 1) {
			smouthenPoint(node.prev, {
				ratio,
				minLength,
				depth: depth - 1,
				recalculate,
			})
			smouthenPoint(node, { ratio, minLength, depth: depth - 1, recalculate })
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

export function lineToSmouthTriangleStripGeometry(
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
	let prev: DoubleLinkedNode<LinePoint> | null = null
	return lines.map((line) => {
		swap = !swap
		let points: Vec2D[] = []
		let uvs: Vec2D[] = []

		for (const curr of line.nodes) {
			const uvY = currentLength / lineLength
			uvs.push([swap ? 0 : 1, uvY], [swap ? 1 : 0, uvY])
			const newPoints = lineMitterPositions(curr, lineWidth)
			if (curr === line.first && prev) {
				const width = curr.val.width || lineWidth || 1
				const c = width / dot(prev.val.direction, curr.val.direction)
				const a = Math.sqrt(c * c - width * width) / 2
				if (a > 0.001) {
					if (cross2D(curr.val.direction, prev.val.direction) > 0) {
						newPoints[0] = add(
							newPoints[0],
							mul(-a, curr.val.direction),
						) as Vec2D
						newPoints[1] = add(
							newPoints[1],
							mul(a, curr.val.direction),
						) as Vec2D
						// points[points.length - 2] = add(
						// 	points[points.length - 2],
						// 	mul(-a, prev.val.direction),
						// ) as Vec2D
						// points[points.length - 1] = add(
						// 	points[points.length - 1],
						// 	mul(a, prev.val.direction),
						// ) as Vec2D
					} else {
						newPoints[0] = add(
							newPoints[0],
							mul(a, curr.val.direction),
						) as Vec2D
						newPoints[1] = add(
							newPoints[1],
							mul(-a, curr.val.direction),
						) as Vec2D
						// points[points.length - 2] = add(
						// 	points[points.length - 2],
						// 	mul(a, prev.val.direction),
						// ) as Vec2D
						// points[points.length - 1] = add(
						// 	points[points.length - 1],
						// 	mul(-a, prev.val.direction),
						// ) as Vec2D
					}
				}
			}
			points.push(...newPoints)

			if (curr.next) {
				currentLength += curr.val.length
			}

			prev = curr
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
