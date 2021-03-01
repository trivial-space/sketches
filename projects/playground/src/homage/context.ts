import { baseEvents, getPainterContext } from '../shared-utils/painterState'
import { Ground } from './state/ground'
import { Screens } from './state/screens'
import { PerspectiveViewportState } from '../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {
	ground: Ground
	screens: Screens
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const getCanvasSize = () => [canvas.width, canvas.height]

export const events = {
	...baseEvents,
}
