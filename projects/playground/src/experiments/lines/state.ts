import { Line, walkLine } from './lines'
import { doTimes, times } from 'tvs-libs/dist/utils/sequence'

const last = <T>(arr: T[]) => arr[arr.length - 1]

export const line1 = times(x => x, 30).reduce((segments, _i) => {
	return segments.concat(
		walkLine(
			{
				length: 1,
				polarAngleY: Math.PI / 2,
				azimuthAngleZ: 1,
			},
			last(segments),
		),
	)
}, [] as Line)
