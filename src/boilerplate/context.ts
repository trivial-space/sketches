import { baseEvents, getPainter, getState } from 'shared-utils/painterState'
import { BaseState } from 'shared-utils/painterState'
import { Entities } from './state'
import { ViewPort } from './viewport'

export interface State extends BaseState {
	viewPort: ViewPort
	entities: Entities
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents
}
