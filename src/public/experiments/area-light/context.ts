import { SceneState } from './state'
import { PerspectiveViewportState } from '../../../shared-utils/vr/perspectiveViewport'
import {
	baseEvents,
	getPainterContext,
} from '../../../shared-utils/app/painterState'

export interface State extends PerspectiveViewportState {
	scene: SceneState
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const events = {
	...baseEvents,
}

export const Q = getPainterContext<State>(canvas)
