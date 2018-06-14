import { stream, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { convertStackGLGeometry } from 'tvs-painter/dist/lib/utils/stackgl'
import { triangulate, divideVertical, divideHorizontal, Quad, extrudeBottom, extrudeRight, right } from 'tvs-libs/dist/lib/geometry/quad'
import { flatten, times } from 'tvs-libs/dist/lib/utils/sequence'
import { partial } from 'tvs-libs/dist/lib/fp/core'
import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { normal } from 'tvs-libs/dist/lib/geometry/primitives'


const vertDiv = partial(divideVertical, 0.5, 0.5)
const horzDiv = partial(divideHorizontal, 0.5, 0.5)

function subdivide (quads: Quad[], times = 1): Quad[] {
	for (let i = 0; i < times; i++) {
		quads = flatten(quads.map(q => flatten(vertDiv(q).map(horzDiv))))
	}
	return quads
}


function randomColor () {
	return [normalRand(), normalRand(), normalRand()]
}

export const boxSliceCount = val(10)

function randomDivide (q: Quad, sliceCount: number) {
	const quads: Quad[] = []
	let rest = q
	for (let i = sliceCount; i > 1; i--) {
		const upRatio = 1 / i + (Math.random() * 2 - 1) * 0.5 / i
		const downRatio = 1 / i + (Math.random() * 2 - 1) * 0.5 / i
		const [left, right] = divideVertical(upRatio, downRatio, rest)
		quads.push(left)
		rest = right
	}
	quads.push(rest)
	return quads
}


export const colors = stream(
	[boxSliceCount.HOT],
	(count) => times(randomColor , 4 * count)
)

export const quad = val(extrudeBottom([0, -9, 0], [[-10, 10, -10], [10, 10, -10]])).reset()

function makeSideSegments (q: Quad, count: number) {
	return randomDivide(q, count).map(q => flatten(subdivide(horzDiv(q))))
}

export const box = stream([quad.HOT, boxSliceCount.HOT], (q, count) => {
	const bk = q
	const rt = extrudeRight([0, 0, 20], right(bk))
	const ft = extrudeRight([-20, 0, 0], right(rt))
	const lf = extrudeRight([0, 0, -20], right(ft))
	return [
		makeSideSegments(bk, count),
		makeSideSegments(rt, count),
		makeSideSegments(ft, count),
		makeSideSegments(lf, count)
	]
})


export const faceNormal = stream([box.HOT], b => b.map(q => normal(q[1])))

export const walls = stream(
	[box.HOT, colors.HOT, faceNormal.HOT, boxSliceCount.HOT],
	(b, c, n, sliceCount) => convertStackGLGeometry({
		position: flatten(flatten(b)),
		// color: flatten(b.map((side) => flatten(side.map((slice) => flatten(slice.map((q) => (q as any[]).map(() => pickRandom(c)))))))),
		color: flatten(b.map((side, i) => flatten(side.map((slice, j) => slice.map(() => c[i * sliceCount + j]))))),
		normal: flatten(b.map((side, i) => flatten(side).map(() => n[i]))),
		cells: triangulate(4 * sliceCount * 4 * 2)
	})
)


export const floorQuads = val(subdivide([extrudeBottom([0, 0, -200], [[-100, -5, 100], [100, -5, 100]])], 3))

export const ground = stream(
	[floorQuads.HOT], (q) => convertStackGLGeometry({
		position: flatten(q),
		normal: flatten(q).map(() => [0, 1, 0]),
		color: flatten(q).map(randomColor),
		// color: flatten(q).map(() => [1, 1, 1]),
		cells: triangulate(q.length)
	})
)
