import {
	getPainterContext,
	baseEvents,
} from '../../../shared-utils/app/painterState'
import { PerspectiveViewportState } from '../../../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas, {
	keepPointerDefault: true,
})

export const getCanvasSize = () => [canvas.width, canvas.height]

export const events = {
	...baseEvents,
}
