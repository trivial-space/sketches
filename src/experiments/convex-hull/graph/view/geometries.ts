import { stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { FormData } from 'tvs-painter/dist/lib'
import { nodes } from '../state/nodes'
import { flatten } from 'tvs-libs/dist/lib/utils/sequence'



export const points = stream(
	[nodes.HOT],
	(nodes) => ({
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
