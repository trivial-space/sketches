import {
	baseEvents,
	BaseState,
	getPainter,
	getState,
} from 'shared-utils/painterState'
import { SceneState } from './state'
import { ViewPort } from './viewport'

export interface State extends BaseState {
	viewPort: ViewPort
	scene: SceneState
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents,
}