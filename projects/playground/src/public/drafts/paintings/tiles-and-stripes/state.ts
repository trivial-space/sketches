import { times, flatten, range } from 'tvs-libs/dist/utils/sequence'
import {
	createLine,
	newLinePoint,
} from '../../../../shared-utils/geometry/lines_2d'
import { add, mul, normalize, sub, Vec } from 'tvs-libs/dist/math/vectors'
import { bezierCurve3P } from 'tvs-libs/dist/geometry/curves'

export function makeLine(
	top: number,
	left: number,
	width: number,
	height: number,
	lineWidth: number,
) {
	const steps = height / (lineWidth * 1.3)

	const step = height / steps
	const start = [left, top]
	const end = [left, top + step / 2]
	const [sX, sY] = start
	const [eX, eY] = end

	const delta = () => lineWidth * 1.5 * (Math.random() - 0.5)

	const points = flatten(
		times(
			(i) => [
				makeCurve(
					[sX + delta(), sY + step * i + delta()],
					[eX + delta(), eY + step * i + delta()],
				),
				makeCurve(
					[eX + delta(), eY + step * i + delta()],
					[sX + delta(), sY + step * (i + 1) + delta()],
					true,
				),
			],
			steps,
		),
	)
		.concat([
			makeCurve(
				[sX + delta(), sY + height + delta()],
				[eX + delta(), eY + height + delta()],
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
	const p3 = add(mul(Math.random() * 0.3 - 0.1, t), add(p1, mul(0.5, line)))
	return range(0.1, 1, 0.1).map((t) => bezierCurve3P(p1, p3, p2, t))
}
