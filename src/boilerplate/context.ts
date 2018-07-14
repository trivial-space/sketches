import { getPainter, getState, baseEvents } from 'shared-utils/painterState'
import { State } from './types'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<State>()

export const events = {
	...baseEvents
}
