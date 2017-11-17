import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { yieldTimes, mapcat } from 'tvs-libs/dist/lib/utils/sequence'
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
	[nodes.HOT],
	(nodes) => mapcat(nodes, node => {
		if (node.id < nodes.length - 3) {
			const i1 = randIntInRange(node.id + 1, nodes.length - 1)
			const cs = [[node.id, i1]]
			const i2 = randIntInRange(node.id + 1, nodes.length - 1)
			if (i2 !== i1) {
				cs.push([node.id, i2])
			}
			return cs
		} else {
			return []
		}
	})
)
