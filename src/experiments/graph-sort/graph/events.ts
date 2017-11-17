import { asyncStreamStart, streamStart } from 'tvs-flow/dist/lib/utils/entity-reference'
import { windowSize as getWindowSize } from 'tvs-libs/dist/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/dist/lib/events/animation'


export const canvas = streamStart(null,
	() => document.getElementById('canvas') as HTMLCanvasElement || undefined
)

export const tick = asyncStreamStart(null, animateWithTPF)

export const windowSize = asyncStreamStart(null, getWindowSize)
