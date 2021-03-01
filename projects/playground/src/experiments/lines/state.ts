import { times } from 'tvs-libs/dist/utils/sequence'
import { events, Q } from './context'
import { noise2d } from 'tvs-libs/dist/math/noise'
import { walkLine, Line, lineSegment } from '../../shared-utils/geometry/lines'

const last = <T>(arr: T[]) => arr[arr.length - 1]

Q.set('lines', { line1: [] })

Q.listen('lines', events.FRAME, (s) => {
	s.lines.line1 = times((x) => x, 100).reduce(
		(segments, i) => {
			return segments.concat(
				walkLine(
					{
						length: 1,
						normalAngle: noise2d(i / 6, s.time / 40) / 2,
						// normalAngle: -0.1,
						// directionAngle: Math.PI / 2,
						// directionAngle: s.time / 2,
						tangentAngle: 0.1,
						// directionAngle: 0.1,
					},
					last(segments),
				),
			)
		},
		[lineSegment({ direction: [0, 0, 1], normal: [-1, 0, 0] })] as Line,
	)
})
