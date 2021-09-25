import { times } from 'tvs-libs/dist/utils/sequence'
import {
	newLinePoint,
	startLine,
} from '../../../../shared-utils/geometry/lines_2d'

export function strokePatch(
	width: number,
	height: number,
	pointsCount: number,
) {
	const [first, ...points] = times(
		(i) =>
			[(Math.random() - 0.5) * width, (Math.random() - 0.5) * height] as [
				number,
				number,
			],
		pointsCount,
	)

	return points.reduce((line, point) => {
		return line.append(newLinePoint(point))
	}, startLine(newLinePoint(first)))
}

export function strokePatch2(pointsCount: number) {
	const [first, ...points] = times(
		(i) =>
			[
				Math.sin(Math.PI * 2 * (i / pointsCount)) * 0.8,
				Math.cos(Math.PI * 2 * (i / pointsCount)) * 0.8,
			] as [number, number],
		pointsCount + 1,
	)

	return points.reduce((line, point) => {
		return line.append(newLinePoint(point))
	}, startLine(newLinePoint(first)))
}
