import { canvasSize } from 'experiments/graph-sort/graph/view/context'
import { alter, M } from 'shared-utils/fp'
import { stream, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { randInt, randIntInRange } from 'tvs-libs/dist/lib/math/random'
import { add, div, length, mul, normalize, sub } from 'tvs-libs/dist/lib/math/vectors'
import { flatten, times } from 'tvs-libs/dist/lib/utils/sequence'
import * as events from '../events'


export const nodeCount = val(40)


export const nameSpaceCount = val(6)


export const nodes = stream(
	[nodeCount.HOT, nameSpaceCount.HOT, canvasSize.HOT],
	(count, nsCount, size) => times(i => ({
		id: i,
		pos: [Math.random() * size.width, Math.random() * size.height],
		ns: randInt(nsCount),
		force: [0, 0]
	}), count)
)


export const connections = stream(
	[nodeCount.HOT],
	(count) => flatten(times(i => {
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

		function updateForces (force: M<number>, dir: M<number[]>, from: any, to: any) {
			const update = (f: M<number>) => (v: number[]) =>
				f.combine(mul, dir)
				.pull(add, v)
				.value

			alter(from, 'force', update(force))
			alter(to, 'force', update(force.map(f => -f)))
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

			updateForces(force, dir, n1, n2)
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

				updateForces(force, dir, n1, n2)

				if (n2.ns === n1.ns) {
					const force = dist.map(d => d - 100)
					updateForces(force, dir, n1, n2)
				} else {
					const force = dist.map(d => -Math.max(200 - d, 0))
					updateForces(force, dir, n1, n2)
				}
			}
		}

		for (const node of nodes) {
			const force = node.force
			const l = length(force) - 3
			if (l > 0) {
				const n = div(l + 3, force)
				node.pos = add(node.pos, mul(l * (tpf / 500), n))
				node.force = [0, 0]
			}
		}
		return nodes
	}
)
