import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { FormData } from 'tvs-painter/dist'
import { nodes } from '../state/nodes'
import { flatten } from 'tvs-libs/dist/utils/sequence'

export const points = stream(
	[nodes.HOT],
	nodes =>
		({
			drawType: 'POINTS',
			attribs: {
				position: {
					buffer: new Float32Array(flatten(nodes)),
					storeType: 'DYNAMIC'
				}
			},
			itemCount: nodes.length
		} as FormData)
)
