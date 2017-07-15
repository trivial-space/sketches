import { asyncStream, asyncStreamStart } from 'tvs-flow/lib/utils/entity-reference'
import { keyboard } from 'tvs-libs/lib/events/keyboard'
import { mouse as getMouse } from 'tvs-libs/lib/events/mouse'
import { windowSize as getWindowSize } from 'tvs-libs/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/lib/events/animation'
import * as init from './state/init'


export const tick = asyncStream([init.images.HOT], animateWithTPF)

export const windowSize = asyncStreamStart(null, getWindowSize)

export const mouse = asyncStreamStart(null, getMouse)

export const keys = asyncStreamStart(null, keyboard)
