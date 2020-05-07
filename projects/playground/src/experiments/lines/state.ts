import { Line, walkLine } from './lines'
import { doTimes, times } from 'tvs-libs/dist/utils/sequence'
import { State, events } from './context'
import { set, addSystem } from '../../shared-utils/painterState'

const last = <T>(arr: T[]) => arr[arr.length - 1]

set<State>('lines', {
	line1: [],
})

addSystem<State>('lines', (e, s) => {
	if (e === events.FRAME) {
		s.lines.line1 = times((x) => x, 60).reduce((segments, _i) => {
			return segments.concat(
				walkLine(
					{
						length: 1,
						// polarAngleY: Math.PI / 2,
						polarAngleY: 0.3,
						// azimuthAngleZ: Math.PI,
						azimuthAngleZ: s.time / 10,
					},
					last(segments),
				),
			)
		}, [] as Line)
	}
})
