import { plane } from 'tvs-painter/dist/lib/utils/geometry/plane'
import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'

export const props = val({
	width: 10,
	height: 10,
	segX: 0,
	segY: 0
})

export const geometry = stream([props.HOT], props =>
	plane(props.width, props.height, props.segX, props.segY)
)
