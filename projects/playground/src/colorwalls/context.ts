import { baseEvents, getPainter, getState } from '../shared-utils/painterState'
import { PerspectiveViewportState } from '../shared-utils/vr/perspectiveViewport'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const state = getState<PerspectiveViewportState>()

export const events = {
	...baseEvents,
}
