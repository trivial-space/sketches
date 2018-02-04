import { val, stream, asyncStream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { times } from 'tvs-libs/dist/lib/utils/sequence'
import { canvasSize } from '../view/context'
import { polarToCartesian2D } from 'tvs-libs/dist/lib/math/coords'
import { add } from 'tvs-libs/dist/lib/math/vectors'
import { normalRand } from 'tvs-libs/dist/lib/math/random'


export const pointCount = val(100)

export const nodes = stream(
	[pointCount.HOT, canvasSize.COLD],
	(count, s) => {
		const radius = Math.min(s.height, s.width) * 0.4
		return times(() => add(polarToCartesian2D([
			Math.sqrt(Math.abs(normalRand() * 2 - 1)) * radius,
			Math.random() * 2 * Math.PI
		]), [s.width / 2, s.height / 2]), count) as number[][]
	}
)


export const triples = stream(
	[nodes.HOT],
	(nodes) => {
		const triples: number[][][] = []
		for (let i = 0; i < nodes.length - 1; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				triples.push([nodes[i], nodes[j], nodes[((j + 1) % nodes.length)]])
			}
		}
		return triples
	}
)


export const tripleStream = asyncStream(
	[triples.HOT],
	(send: (n: number[][]) => void, triples) => {
		let i = 0
		function tick () {
			if (i < triples.length) send(triples[i++])
			requestAnimationFrame(tick)
		}
		requestAnimationFrame(tick)
		return () => i = triples.length
	}
)

