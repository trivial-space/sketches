import {
	asyncStream,
	asyncStreamStart,
	streamStart,
	val,
} from 'tvs-flow/dist/lib/utils/entity-reference'
import { animateWithTPF } from 'tvs-libs/dist/events/animation'
import { windowSize as getWindowSize } from 'tvs-libs/dist/events/dom'

export const canvas = streamStart(
	null,
	() => (document.getElementById('canvas') as HTMLCanvasElement) || undefined,
)

export const timeToSort = val(10)

export const tick = asyncStream<number, number>(
	[timeToSort.HOT],
	(send, time) => {
		const stop = animateWithTPF(send)
		setTimeout(stop, time * 1000)
		return stop
	},
)

export const windowSize = asyncStreamStart(null, getWindowSize)
