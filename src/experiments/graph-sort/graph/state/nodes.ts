import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { yieldTimes, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { canvasSize } from 'experiments/graph-sort/graph/view/context'
import { randInt, randIntInRange } from 'tvs-libs/dist/lib/math/core'


export const nodeCount = val(40)


export const nameSpaceCount = val(6)


export const nodes = stream(
	[nodeCount.HOT, nameSpaceCount.HOT, canvasSize.HOT],
	(count, nsCount, size) => yieldTimes(count, i => ({
		id: i,
		x: Math.random() * size.width,
		y: Math.random() * size.height,
		ns: randInt(nsCount)
	}))
)


export const connections = stream(
	[nodeCount.HOT],
	(count) => flatten(yieldTimes(count, i => {
		if (i < count - 3) {
			const i1 = randIntInRange(i + 1, count - 1)
			const cs = [[i, i1] as [number, number]]
			const i2 = randIntInRange(i + 1, count - 1)
			if (i2 !== i1) {
				cs.push([i, i2])
			}
			return cs
		} else {
			return []
		}
	}))
)
