import { times, flatten } from 'tvs-libs/dist/utils/sequence'
import { noise2d } from 'tvs-libs/dist/math/noise'
import {
	createLine,
	newLinePoint,
} from '../../../shared-utils/geometry/lines_2d'

export function makeLine(width: number, height: number, steps: number) {
	const step = height / steps
	const start = [-width / 2, -height / 2]
	const end = [width / 2, -height / 2 + step / 2]
	const [sX, sY] = start
	const [eX, eY] = end

	const seedX = Math.random() * 20
	const seedY = Math.random() * 20

	const deltaX = (i: number) => (width / 8) * noise2d(i, seedX)
	const deltaY = (i: number) => (step / 2) * noise2d(i, seedY)

	const points = flatten(
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
		.flat()

	const line = createLine()

	for (const point of points) {
		line.append(newLinePoint(point as [number, number]), true)
	}

	return line
}
