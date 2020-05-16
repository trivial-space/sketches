import { baseEvents, getPainter, getState } from '../shared-utils/painterState'
import { PerspectiveViewportState } from '../shared-utils/vr/perspectiveViewport'
import { Squeegee } from './state'

export interface State extends PerspectiveViewportState {
	squeegee: Squeegee
	time: number
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents,
}
