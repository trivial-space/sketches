import { polarToCartesian2D } from 'tvs-libs/dist/math/coords'
import { normalRand } from 'tvs-libs/dist/math/random'
import { add } from 'tvs-libs/dist/math/vectors'
import { times } from 'tvs-libs/dist/utils/sequence'
import { canvas } from './context'

const pointCount = 40
const radius = Math.min(canvas.height, canvas.width) * 0.4

export const triples: number[][][] = []

export const nodes = times(
	() =>
		add(
			polarToCartesian2D([
				Math.sqrt(Math.abs(normalRand() * 2 - 1)) * radius,
				Math.random() * 2 * Math.PI,
			]),
			[canvas.width / 2, canvas.height / 2],
		),
	pointCount,
)

for (let i = 0; i < nodes.length - 1; i++) {
	for (let j = i + 1; j < nodes.length; j++) {
		triples.push([nodes[i], nodes[j], nodes[(j + 1) % nodes.length]])
	}
}
