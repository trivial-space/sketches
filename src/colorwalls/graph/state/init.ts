import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { extrudeBottom, right, extrudeRight, Quad, divideVertical, divideHorizontal } from 'tvs-libs/dist/lib/geometry/quad'
import { normal } from 'tvs-libs/dist/lib/geometry/primitives'
import { tick } from '../events'
import { mat4, quat } from 'gl-matrix'
import { times, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { partial } from 'tvs-libs/dist/lib/fp/core'


const vertDiv = partial(divideVertical, 0.5, 0.5)
const horzDiv = partial(divideHorizontal, 0.5, 0.5)

function subdivide (quads: Quad[], times = 1): Quad[] {
	for (let i = 0; i < times; i++) {
		quads = flatten(quads.map(q => flatten(vertDiv(q).map(horzDiv))))
	}
	return quads
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
	(count) => times(() => [normalRand(), normalRand(), normalRand()], 4 * count)
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

export const time = val(0)
.react(
	[tick.HOT],
	(self, tpf) => self + tpf
)

export const rotation = val(quat.create())
	.react(
		[time.HOT],
		(self, time) => quat.fromEuler(
			self,
			Math.sin(0.0007 * time) * 1.1,
			time * 0.001,
			Math.sin(0.0008 * time) * 1.1
		)
	)

export const transform = val(mat4.create())
.react(
	[rotation.HOT],
	(self, rotation) => mat4.fromRotationTranslationScaleOrigin(self, rotation, [0, 0, 0], [1, 1, 1], [0, 100, 0])
)


export const floor = stream([quad.HOT], q => subdivide([q], 3))
