import { div, length, sub } from 'tvs-libs/dist/math/vectors'
import { times, window } from 'tvs-libs/dist/utils/sequence'
import { lineSegment } from '../../../../shared-utils/geometry/lines_3d'

export function strokePatch(width: number, height: number, points: number) {
	const lines = window(
		2,
		times(
			() => [(Math.random() - 0.5) * width, (Math.random() - 0.5) * height],
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
