import { asyncStream, stream, val, asyncStreamStart } from 'tvs-flow/lib/utils/entity-reference'
import { keyboard } from 'tvs-libs/lib/events/keyboard'
import { mouse as getMouse } from 'tvs-libs/lib/events/mouse'
import { windowSize as getWindowSize } from 'tvs-libs/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/lib/events/animation'
import { videos } from './videos'


export const tick = asyncStream([videos.HOT], animateWithTPF)


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

export const mouse = asyncStreamStart(null, getMouse)

export const keys = asyncStreamStart(null, keyboard)
