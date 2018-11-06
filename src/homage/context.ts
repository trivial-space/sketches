import { baseEvents, getPainter, getState } from 'shared-utils/painterState'
import { BaseState } from 'shared-utils/painterState'
import { Ground } from './state/ground'
import { Screens } from './state/screens'
import { ViewPort } from './viewport'


export interface State extends BaseState {
	viewPort: ViewPort,
	ground: Ground,
	screens: Screens
}


export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const getCanvasSize = () => [canvas.width, canvas.height]

export const events = {
	...baseEvents,
	INIT: 'init',
	START: 'start'
}
