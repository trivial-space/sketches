import { getPainter, getState, baseEvents } from 'shared-utils/painterState'
import { BaseState } from 'shared-utils/painterState'
import { ViewPort } from './viewport'
import { Entities } from './state'


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
