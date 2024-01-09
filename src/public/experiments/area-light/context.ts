import {
	baseEvents,
	getPainterContext,
} from '../../../shared-utils/app/painterState'
import { PerspectiveViewportState } from '../../../shared-utils/vr/perspectiveViewport'
import { SceneState } from './state'

export interface State extends PerspectiveViewportState {
	scene: SceneState
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const events = {
	...baseEvents,
}

export const Q = getPainterContext<State>(canvas)
