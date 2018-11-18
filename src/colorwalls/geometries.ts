import { getForm } from 'shared-utils/painterState'
import { partial } from 'tvs-libs/dist/fp/core'
import { normal } from 'tvs-libs/dist/geometry/primitives'
import {
	divideHorizontal,
	divideVertical,
	extrudeBottom,
	extrudeRight,
	Quad,
	right,
	triangulate
} from 'tvs-libs/dist/geometry/quad'
import { normalRand } from 'tvs-libs/dist/math/random'
import { flatten, times } from 'tvs-libs/dist/utils/sequence'
import { convertStackGLGeometry } from 'tvs-painter/dist/lib/utils/stackgl'
import { painter } from './context'

const vertDiv = partial(divideVertical, 0.5, 0.5)
const horzDiv = partial(divideHorizontal, 0.5, 0.5)

function subdivide(quads: Quad[], times = 1): Quad[] {
	for (let i = 0; i < times; i++) {
		quads = flatten(quads.map(q => flatten(vertDiv(q).map(horzDiv))))
	}
	return quads
}

function randomColor() {
	return [normalRand(), normalRand(), normalRand()]
}

const boxSliceCount = 10

function randomDivide(q: Quad, sliceCount: number) {
	const quads: Quad[] = []
	let rest = q
	for (let i = sliceCount; i > 1; i--) {
		const upRatio = 1 / i + ((Math.random() * 2 - 1) * 0.5) / i
		const downRatio = 1 / i + ((Math.random() * 2 - 1) * 0.5) / i
		const [left, right] = divideVertical(upRatio, downRatio, rest)
		quads.push(left)
		rest = right
	}
	quads.push(rest)
	return quads
}

const colors = times(randomColor, 4 * boxSliceCount)

const quad = extrudeBottom([0, -9, 0], [[-10, 10, -10], [10, 10, -10]])

function makeSideSegments(q: Quad, count: number) {
	return randomDivide(q, count).map(q => flatten(subdivide(horzDiv(q))))
}

const box = (() => {
	const count = boxSliceCount
	const bk = quad
	const rt = extrudeRight([0, 0, 20], right(bk))
	const ft = extrudeRight([-20, 0, 0], right(rt))
	const lf = extrudeRight([0, 0, -20], right(ft))
	return [
		makeSideSegments(bk, count),
		makeSideSegments(rt, count),
		makeSideSegments(ft, count),
		makeSideSegments(lf, count)
	]
})()

export const faceNormals = box.map(q => normal(q[1]))

export const wallsForm = getForm(painter, 'wallsForm').update(
	convertStackGLGeometry({
		position: flatten(flatten(box)),
		// color: flatten(b.map((side) => flatten(side.map((slice) => flatten(slice.map((q) => (q as any[]).map(() => pickRandom(c)))))))),
		color: flatten(
			box.map((side, i) =>
				flatten(
					side.map((slice, j) => slice.map(() => colors[i * boxSliceCount + j]))
				)
			)
		),
		normal: flatten(
			box.map((side, i) => flatten(side).map(() => faceNormals[i]))
		),
		cells: triangulate(4 * boxSliceCount * 4 * 2)
	})
)

export const groundHeight = -5
const floorQuads = subdivide(
	[
		extrudeBottom(
			[0, 0, -200],
			[[-100, groundHeight, 100], [100, groundHeight, 100]]
		)
	],
	3
)

export const groundForm = getForm(painter, 'groundForm').update(
	convertStackGLGeometry({
		position: flatten(floorQuads),
		normal: flatten(floorQuads).map(() => [0, 1, 0]),
		cells: triangulate(floorQuads.length)
	})
)
