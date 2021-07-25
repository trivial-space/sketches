import { times, window } from 'tvs-libs/dist/utils/sequence'
import { Q } from './context'
import { lineSegment } from '../../../../shared-utils/geometry/lines'
import { div, length, sub } from 'tvs-libs/dist/math/vectors'

export function strokePatch2(width: number, height: number, points: number) {
	const lines = window(
		2,
		times(
			(i) => [(Math.random() - 0.5) * width, (Math.random() - 0.5) * height],
			points,
		),
	).flatMap(([p1, p2]) => {
		const dir = sub(p2, p1)
		const len = length(dir)
		const direction = div(len, dir)
		return lineSegment({ vertex: p1, direction, length: len })
	})

	return lines
}

Q.set('lines', { line1: [] })
