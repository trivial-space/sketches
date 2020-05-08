import { times, repeat, zip } from 'tvs-libs/dist/utils/sequence'
import { State, events } from './context'
import { set, addSystem } from '../shared-utils/painterState'
import { noise2d, noise1d } from 'tvs-libs/dist/math/noise'
import { walkLine, lineSegment, Line } from '../shared-utils/geometry/lines'
import { normalize, add, length, mul, sub } from 'tvs-libs/dist/math/vectors'

function easeOutQuad(x: number) {
	return 1 - (1 - x) * (1 - x)
}

const last = <T>(arr: T[]) => arr[arr.length - 1]

export function line(
	start: [number, number],
	end: [number, number],
	fragments = 20,
) {
	const vec = sub(end, start)
	const len = length(vec)
	const dir = mul(1 / len, vec)
	const normal = [dir[1], -dir[0]]

	const parts = repeat(fragments, 1 / fragments).map((x, i) => x * i)
	const steps = parts.map(easeOutQuad).map((x) => x * len)

	const seed = Math.random() * 10
	const distortStrengths = parts.map(
		(x) => (Math.sin(x * Math.PI) * noise2d(x * 3, seed) * len) / fragments,
	)

	const points = zip((a, b) => [a, b], steps, distortStrengths)
		.map(([step, distortStrength]) => {
			const p = add(add(start, mul(step, dir)), mul(distortStrength, normal))
			return p
		})
		.concat([end])

	console.log(distortStrengths)
	return points
}

function scratchPatch(width: number, height: number, lines: number) {}

set<State>('lines', {
	line1: [],
})
