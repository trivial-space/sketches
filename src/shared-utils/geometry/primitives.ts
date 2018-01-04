import { zip } from 'tvs-libs/dist/lib/utils/sequence'
import { partial } from 'tvs-libs/dist/lib/fp/core'
import { lerp } from 'tvs-libs/dist/lib/math/core'


export type Edge = [number[], number[]]

export type Quad = [number[], number[], number[], number[]]


export function interpolate (
	fn: (start: number, end: number, step: number) => number,
	step: number, start: number[], end: number[]
) {
	zip(partial(fn, step), start, end)
}


export const lerpVecs = partial(interpolate, lerp)


export function split (part: number, [v1, v2]: Edge) {
	const p = lerpVecs(part, v1, v2)
	return [[v1, p], [p, v2]]
}
