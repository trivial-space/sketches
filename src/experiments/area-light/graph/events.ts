import {
	asyncStream,
	asyncStreamStart,
	EntityRef,
	streamStart
} from 'tvs-flow/dist/lib/utils/entity-reference'
import { animateWithTPF } from 'tvs-libs/dist/events/animation'
import { windowSize as getWindowSize } from 'tvs-libs/dist/events/dom'
import { keyboard, KeyState } from 'tvs-libs/dist/events/keyboard'
import { mouse as getMouse, MouseState } from 'tvs-libs/dist/events/mouse'

export const canvas = streamStart(
	null,
	() => (document.getElementById('canvas') as HTMLCanvasElement) || undefined
)

export const tick = asyncStreamStart(null, animateWithTPF)

export const windowSize = asyncStreamStart(null, getWindowSize)

export const mouse: EntityRef<MouseState> = asyncStream(
	[canvas.HOT],
	(send, canvas) => getMouse({ element: canvas, enableRightButton: true }, send)
)

export const keys = asyncStreamStart<KeyState>(null, keyboard)
