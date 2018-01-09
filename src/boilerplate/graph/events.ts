import { asyncStream, EntityRef, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { keyboard, KeyState } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse as getMouse, MouseState } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize as getWindowSize } from 'tvs-libs/dist/lib/events/dom'
import { animateWithTPF } from 'tvs-libs/dist/lib/events/animation'


export const canvas = val(document.getElementById('canvas') as HTMLCanvasElement)

export const tick = asyncStream([canvas.HOT], animateWithTPF)

export const windowSize = asyncStream([canvas.HOT], getWindowSize)

export const mouse: EntityRef<MouseState> = asyncStream([canvas.HOT],
	(send, canvas) => getMouse({element: canvas, enableRightButton: true}, send)
)

export const keys: EntityRef<KeyState> = asyncStream([canvas.HOT],
	send => keyboard(send))
