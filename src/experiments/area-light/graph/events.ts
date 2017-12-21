import { asyncStreamStart, EntityRef, asyncStream, streamStart } from 'tvs-flow/dist/lib/utils/entity-reference'
import { keyboard } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse as getMouse, MouseState } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize as getWindowSize } from 'tvs-libs/dist/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/dist/lib/events/animation'


export const canvas = streamStart(null,
	() => document.getElementById('canvas') as HTMLCanvasElement || undefined
)

export const tick = asyncStreamStart(null, animateWithTPF)

export const windowSize = asyncStreamStart(null, getWindowSize)

export const mouse: EntityRef<MouseState> = asyncStream([canvas.HOT],
	(send, canvas) => getMouse({element: canvas, enableRightButton: true}, send)
)

export const keys = asyncStreamStart(null, keyboard)
