import { times, flatten } from 'tvs-libs/dist/utils/sequence'
import { Q } from './context'
import { noise2d } from 'tvs-libs/dist/math/noise'
import { lineSegment } from '../../../../shared-utils/geometry/lines'
import { div, length, sub } from 'tvs-libs/dist/math/vectors'

export function strokePatch(width: number, height: number, steps: number) {
	const step = height / steps
	const start = [-width / 2, -height / 2]
	const end = [width / 2, -height / 2 + step / 2]
	const [sX, sY] = start
	const [eX, eY] = end

	const seedX = Math.random() * 20
	const seedY = Math.random() * 20

	const deltaX = (i: number) => (width / 8) * noise2d(i, seedX)
	const deltaY = (i: number) => (step / 2) * noise2d(i, seedY)

	const lines = flatten(
		times(
			(i) =>
				[
					[
						[sX + deltaX(i), sY + step * i + deltaY(i)],
						[eX + deltaX(i + steps), eY + step * i + deltaY(i + steps)],
					],
					[
						[eX + deltaX(i + steps), eY + step * i + deltaY(i + steps)],
						[sX + deltaX(i + 1), sY + step * (i + 1) + deltaY(i + 1)],
					],
				] as const,
			steps,
		),
	)
		.concat([
			[
				[sX + deltaX(steps), sY + height + deltaY(steps)],
				[eX + deltaX(steps + steps), eY + height + deltaY(steps + steps)],
			],
		] as const)
		.flatMap(([p1, p2]) => {
			const dir = sub(p2, p1)
			const len = length(dir)
			const direction = div(len, dir)
			return lineSegment({ vertex: p1, direction, length: len })
		})

	return lines
}

Q.set('lines', { line1: [] })
