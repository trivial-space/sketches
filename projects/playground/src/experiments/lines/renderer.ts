import { getForm } from '../../shared-utils/painterState'
import { painter } from './context'
import { line1 } from './state'
import { flatMap } from 'tvs-libs/dist/utils/sequence'

const form = getForm(painter, 'lines').update({
	attribs: {
		position: {
			buffer: new Float32Array(flatMap(seg => seg.vertex, line1)),
		},
	},
	drawType: 'LINES',
	itemCount: line1.length,
})
