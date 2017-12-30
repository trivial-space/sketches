import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { times } from 'tvs-libs/dist/lib/utils/sequence'
import { canvasSize } from '../view/context'


export const nodeCount = val(100)


export const nodes = stream(
	[nodeCount.HOT, canvasSize.COLD],
	(count, size) => times(() => [
		Math.random() * size.width * 0.8 + size.width * 0.1,
		Math.random() * size.height * 0.8 + size.height * 0.1
	], count)
)
