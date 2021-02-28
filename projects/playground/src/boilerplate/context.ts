import { baseEvents, getPainterContext } from '../shared-utils/painterState'
import { Entities } from './state'
import { PerspectiveViewportState } from '../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {
	entities: Entities
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const $ = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}
