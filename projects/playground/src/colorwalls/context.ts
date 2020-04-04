import {
	baseEvents,
	BaseState,
	getPainter,
	getState,
} from '../shared-utils/painterState'
import { ViewPort } from './camera'

export interface State extends BaseState {
	viewPort: ViewPort
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents,
}
