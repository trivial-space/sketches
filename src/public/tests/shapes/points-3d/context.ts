import {
	getPainterContext,
	baseEvents,
} from '../../../../shared-utils/app/painterState'
import { PerspectiveViewportState } from '../../../../shared-utils/vr/perspectiveViewport'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<PerspectiveViewportState>(canvas)

export const events = {
	...baseEvents,
}
