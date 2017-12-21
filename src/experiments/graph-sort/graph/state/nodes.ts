import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { yieldTimes, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { canvasSize } from 'experiments/graph-sort/graph/view/context'
import { randInt, randIntInRange } from 'tvs-libs/dist/lib/math/random'
import * as events from '../events'
import { sub, length, normalize, mul, add } from 'tvs-libs/dist/lib/math/vectors'


export const nodeCount = val(40)


export const nameSpaceCount = val(6)


export const nodes = stream(
	[nodeCount.HOT, nameSpaceCount.HOT, canvasSize.HOT],
	(count, nsCount, size) => yieldTimes(i => ({
		id: i,
		pos: [Math.random() * size.width, Math.random() * size.height],
		ns: randInt(nsCount)
	}), count)
)


export const connections = stream(
	[nodeCount.HOT],
	(count) => flatten(yieldTimes(i => {
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
	}, count))
)


export const springLength = val(200)


nodes.react(
	[events.tick.HOT, springLength.COLD, connections.COLD],
	(nodes, tpf, springLength, connections) => {
		const forces = yieldTimes(
			() => [0, 0],
			nodes.length
		)

		for (const c of connections) {
			const n1 = nodes[c[0]]
			const n2 = nodes[c[1]]
			const vec = sub(n2.pos, n1.pos)
			const dist = length(vec)
			const dir = normalize(vec)
			const diff = dist - springLength
			const force = diff * 2
			forces[n1.id] = add(forces[n1.id], mul(force, dir))
			forces[n2.id] = add(forces[n2.id], mul(force * -1, dir))
		}

		for (let i = 0; i < nodes.length - 1; i++) {
			const n1 = nodes[i]
			for (let j = i + 1; j < nodes.length; j++) {
				const n2 = nodes[j]

				const vec = sub(n2.pos, n1.pos)
				const dist = length(vec)
				const dir = normalize(vec)
				const force = Math.max(100 - dist, 0)
				forces[n1.id] = add(forces[n1.id], mul(force * -1, dir))
				forces[n2.id] = add(forces[n2.id], mul(force, dir))

				if (n2.ns === n1.ns) {
					const force = dist - 100
					forces[n1.id] = add(forces[n1.id], mul(force, dir))
					forces[n2.id] = add(forces[n2.id], mul(force * -1, dir))
				} else {
					const force = Math.max(200 - dist, 0)
					forces[n1.id] = add(forces[n1.id], mul(force * -1, dir))
					forces[n2.id] = add(forces[n2.id], mul(force, dir))
				}

			}
		}

		for (let i = 0; i < forces.length; i++) {
			const force = forces[i]
			const l = length(force) - 3
			if (l > 0) {
				const n = normalize(force)
				nodes[i].pos = add(nodes[i].pos, mul(l * (tpf / 500), n))
			}
		}
		return nodes
	}
)
