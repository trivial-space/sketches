import { bezierCurve3P } from 'tvs-libs/dist/geometry/curves'
import { noise2d } from 'tvs-libs/dist/math/noise'
import { add, mul, normalize, sub, Vec } from 'tvs-libs/dist/math/vectors'
import { times, flatten, range } from 'tvs-libs/dist/utils/sequence'
import {
	createLine,
	newLinePoint,
} from '../../../../shared-utils/geometry/lines_2d'

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
			(i) => [
				makeCurve(
					[sX + deltaX(i), sY + step * i + deltaY(i)],
					[eX + deltaX(i + steps), eY + step * i + deltaY(i + steps)],
				),
				makeCurve(
					[eX + deltaX(i + steps), eY + step * i + deltaY(i + steps)],
					[sX + deltaX(i + 1), sY + step * (i + 1) + deltaY(i + 1)],
					true,
				),
			],
			steps,
		),
	)
		.concat([
			makeCurve(
				[sX + deltaX(steps), sY + height + deltaY(steps)],
				[eX + deltaX(steps + steps), eY + height + deltaY(steps + steps)],
			),
		])
		.flat()

	const line = createLine()

	for (const point of points) {
		line.append(newLinePoint(point as [number, number]), true)
	}

	return line
}

function makeCurve(p1: Vec, p2: Vec, reverse = false) {
	const line = sub(p2, p1)
	const t = normalize(reverse ? [-line[1], line[0]] : [line[1], -line[0]])
	const p3 = add(mul(Math.random() * 0.4, t), add(p1, mul(0.5, line)))
	return range(0.1, 1, 0.1).map((t) => bezierCurve3P(p1, p3, p2, t))
}
