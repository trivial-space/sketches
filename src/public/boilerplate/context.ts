import {
	baseEvents,
	getPainterContext,
} from '../../shared-utils/app/painterState'
import { PerspectiveViewportState } from '../../shared-utils/vr/perspectiveViewport'
import { Entities } from './state'

export interface State extends PerspectiveViewportState {
	entities: Entities
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}
