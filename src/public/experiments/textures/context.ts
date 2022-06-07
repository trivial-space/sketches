import { getPainterContext, baseEvents } from 'tvs-utils/dist/app/painterState'
import { PerspectiveViewportState } from '../../../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {
	time: number
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}
