import {
	baseEvents,
	BaseState,
	getPainter,
	getState,
} from '../shared-utils/painterState'

export type State = BaseState

export const canvas = document.getElementById('canvas') as HTMLCanvasElement
export const paint = document.getElementById('paint') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents,
	PROCESS_PAINT: 'process_paint',
	CLEANUP_PAINT: 'cleanup_paint',
}