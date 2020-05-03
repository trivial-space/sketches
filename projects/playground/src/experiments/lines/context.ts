import {
	baseEvents,
	getPainter,
	getState,
} from '../../shared-utils/painterState'
import { PerspectiveViewportState } from '../../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {
	time: number
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents,
}
