import { times, flatten, range } from 'tvs-libs/dist/utils/sequence'
import {
	createLine,
	newLinePoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { add, mul, normalize, sub, Vec } from 'tvs-libs/dist/math/vectors'
import { bezierCurve3P } from 'tvs-libs/dist/geometry/curves'
import { noise2d } from 'tvs-libs/dist/math/noise'

export function makeBrushStroke(
	top: number,
	left: number,
	width: number,
	height: number,
	lineWidth: number,
) {
	const steps = Math.floor(height / (lineWidth * 1.2))

	const stepY = (height - lineWidth * 1.5) / steps

	const start = [left - lineWidth / 3, top + lineWidth / 1.5]
	const end = [left + width + lineWidth / 3, top + lineWidth / 1.5 + stepY / 2]
	const [sX, sY] = start
	const [eX, eY] = end

	const seedX = Math.random() * 20
	const seedY = Math.random() * 20

	const deltaX = (i: number) => lineWidth * 0.7 * noise2d(i, seedX)
	const deltaY = (i: number) => lineWidth * 0.4 * noise2d(i, seedY)

	const points = flatten(
		times(
			(i) => [
				makeCurve(
					[sX + deltaX(i), sY + stepY * i + deltaY(i)],
					[eX + deltaX(i + steps), eY + stepY * i + deltaY(i + steps)],
					false,
					lineWidth,
				),
				makeCurve(
					[eX + deltaX(i + steps), eY + stepY * i + deltaY(i + steps)],
					[sX + deltaX(i + 1), sY + stepY * (i + 1) + deltaY(i + 1)],
					true,
					lineWidth,
				),
			],
			steps,
		),
	)
		.concat([
			makeCurve(
				[sX + deltaX(steps), sY + stepY * steps + deltaY(steps)],
				[
					eX + deltaX(steps + steps),
					eY + stepY * steps + deltaY(steps + steps),
				],
				false,
				lineWidth,
			),
		])
		.flat()

	const line = createLine()

	for (const point of points) {
		line.append(newLinePoint(point as [number, number]), true)
	}

	return line
}

function makeCurve(p1: Vec, p2: Vec, reverse = false, maxHeight: number) {
	const line = sub(p2, p1)
	const t = normalize(reverse ? [-line[1], line[0]] : [line[1], -line[0]])
	const p3 = add(
		mul((Math.random() * 1.5 - 0.6) * maxHeight, t),
		add(p1, mul(0.5, line)),
	)
	return range(0.1, 1, 0.1).map((t) => bezierCurve3P(p1, p3, p2, t))
}
