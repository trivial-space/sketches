import { val, asyncStream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { windowSize as getWindowSize } from 'tvs-libs/dist/events/dom'

export const canvas = val(document.getElementById(
	'canvas'
) as HTMLCanvasElement)

export const windowSize = asyncStream([canvas.HOT], getWindowSize)
