import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { yieldTimes, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { canvasSize } from 'experiments/graph-sort/graph/view/context'
import { randInt, randIntInRange } from 'tvs-libs/dist/lib/math/random'
import * as events from '../events'
import { sub, length, normalize, mul, add, div } from 'tvs-libs/dist/lib/math/vectors'
import { M, alter } from 'shared-utils/fp'


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

		function updateForces(force, dir, fromIdx, toIdx) {
			const update = f => v =>
				f.combine(mul, dir)
				.pull(add, v)
				.value

			alter(forces, fromIdx, update(force))
			alter(forces, toIdx, update(force.map(f => -f)))
		}

		for (const c of connections) {
			const n1 = nodes[c[0]]
			const n2 = nodes[c[1]]

			const vec = M.of(n2.pos)
				.pull(sub, n1.pos)

			const dir = vec
				.map(normalize)

			const force = vec
				.map(length)
				.map(l => l - springLength)
				.map(v => v * 2)

			updateForces(force, dir, n1.id, n2.id)
		}


		for (let i = 0; i < nodes.length - 1; i++) {
			const n1 = nodes[i]
			for (let j = i + 1; j < nodes.length; j++) {
				const n2 = nodes[j]

				const vec = M.of(n2.pos)
					.pull(sub, n1.pos)

				const dir = vec.map(normalize)
				const dist = vec.map(length)
				const force = dist.map(l => -Math.max(100 - l, 0))

				updateForces(force, dir, n1.id, n2.id)

				if (n2.ns === n1.ns) {
					const force = dist.map(d => d - 100)
					updateForces(force, dir, n1.id, n2.id)
				} else {
					const force = dist.map(d => -Math.max(200 - d, 0))
					updateForces(force, dir, n1.id, n2.id)
				}
			}
		}

		for (let i = 0; i < forces.length; i++) {
			const force = forces[i]
			const l = length(force) - 3
			if (l > 0) {
				const n = div(l + 3, force)
				nodes[i].pos = add(nodes[i].pos, mul(l * (tpf / 500), n))
			}
		}
		return nodes
	}
)
