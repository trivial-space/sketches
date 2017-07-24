import { asyncStreamStart } from 'tvs-flow/dist/lib/utils/entity-reference'
import { keyboard } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse as getMouse } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize as getWindowSize } from 'tvs-libs/dist/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/dist/lib/events/animation'


export const tick = asyncStreamStart(null, animateWithTPF)

export const windowSize = asyncStreamStart(null, getWindowSize)

export const mouse = asyncStreamStart(null, getMouse)

export const keys = asyncStreamStart(null, keyboard)
