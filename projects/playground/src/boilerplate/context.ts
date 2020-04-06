import {
	baseEvents,
	BaseState,
	getPainter,
	getState,
} from '../shared-utils/painterState'
import { Entities } from './state'
import { PerspectiveViewportState } from '../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {
	entities: Entities
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents,
}
