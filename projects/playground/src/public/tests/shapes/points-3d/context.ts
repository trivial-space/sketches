import {
	baseEvents,
	getPainterContext,
} from '../../../../shared-utils/painterState'
import { PerspectiveViewportState } from '../../../../shared-utils/vr/perspectiveViewport'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<PerspectiveViewportState>(canvas)

export const events = {
	...baseEvents,
}
