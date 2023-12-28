import { Entities } from './state'
import { PerspectiveViewportState } from '../../shared-utils/vr/perspectiveViewport'
import {
	baseEvents,
	getPainterContext,
} from '../../shared-utils/app/painterState'

export interface State extends PerspectiveViewportState {
	entities: Entities
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}
