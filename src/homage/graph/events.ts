import { asyncStream, stream, val, asyncStreamStart, streamStart, EntityRef } from 'tvs-flow/dist/lib/utils/entity-reference'
import { keyboard } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse as getMouse, MouseState } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize as getWindowSize } from 'tvs-libs/dist/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/dist/lib/events/animation'
import { videos } from './videos'


export const tick = asyncStream([videos.HOT], animateWithTPF)


export const canvas = streamStart(null,
	() => document.getElementById('canvas') as HTMLCanvasElement || undefined
)

export const tickStep = val(2)

export const tickCounter = val(0)
.react(
	[tickStep.HOT, tick.HOT],
	(self, max) => self === max ? 0 : self + 1
)

export const slowTick = stream(
	[tickCounter.HOT],
	cnt => cnt === 0 ? true : null
)

export const windowSize = asyncStreamStart(null, getWindowSize)

export const mouse: EntityRef<MouseState> = asyncStream([canvas.HOT],
	(send, canvas) => getMouse(send, {element: canvas, enableRightButton: true})
)

export const keys = asyncStreamStart(null, keyboard)
