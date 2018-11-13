import { baseEvents, getPainter, getState } from 'shared-utils/painterState'
import { BaseState } from 'shared-utils/painterState'

export interface State extends BaseState {}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents
}
