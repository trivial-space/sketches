import { times, flatten, range } from 'tvs-libs/dist/utils/sequence'
import { createLine, newLinePoint } from '../../geometry/lines_2d'
import { add, mul, normalize, sub, Vec } from 'tvs-libs/dist/math/vectors'
import { bezierCurve3P } from 'tvs-libs/dist/geometry/curves'
import { noise2d } from 'tvs-libs/dist/math/noise'

interface BrushStrokeOptions {
	width: number
	height: number
	top: number
	left: number
	steps: number
	offsetX: number
	offsetY: number
	curveHeight: number
	heightFactorFunction?: (n: number) => number
}

export function makeBrushStroke({
	top,
	left,
	width,
	height,
	steps,
	offsetY,
	offsetX,
	curveHeight,
	heightFactorFunction = (n) => n,
}: BrushStrokeOptions) {
	const stepY = height / steps

	const start = [left, top]
	const end = [left + width, top + stepY / 2]
	const [sX, sY] = start
	const [eX, eY] = end

	const seedX = Math.random() * 20
	const seedY = Math.random() * 20

	const deltaX = (i: number) => offsetX * noise2d(i, seedX)
	const deltaY = (i: number) => offsetY * noise2d(i, seedY)

	const points = flatten(
		times(
			(i) => [
				makeCurve(
					[sX + deltaX(i), sY + stepY * i + deltaY(i)],
					[eX + deltaX(i + steps), eY + stepY * i + deltaY(i + steps)],
					false,
					curveHeight,
					heightFactorFunction,
				),
				makeCurve(
					[eX + deltaX(i + steps), eY + stepY * i + deltaY(i + steps)],
					[sX + deltaX(i + 1), sY + stepY * (i + 1) + deltaY(i + 1)],
					true,
					curveHeight,
					heightFactorFunction,
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
				curveHeight,
				heightFactorFunction,
			),
		])
		.flat()

	const line = createLine()

	for (const point of points) {
		line.append(newLinePoint(point as [number, number]), true)
	}

	return line
}

function makeCurve(
	p1: Vec,
	p2: Vec,
	reverse = false,
	maxHeight: number,
	heightFactorFunction: (n: number) => number,
) {
	const line = sub(p2, p1)
	const t = normalize(reverse ? [-line[1], line[0]] : [line[1], -line[0]])
	const p3 = add(
		mul(heightFactorFunction(Math.random()) * maxHeight, t),
		add(p1, mul(0.5, line)),
	)
	return range(0.1, 1, 0.1).map((t) => bezierCurve3P(p1, p3, p2, t))
}
