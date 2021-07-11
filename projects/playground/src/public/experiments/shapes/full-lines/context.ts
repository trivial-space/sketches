import {
	baseEvents,
	getPainterContext,
} from '../../../../shared-utils/painterState'
import { PerspectiveViewportState } from '../../../../shared-utils/vr/perspectiveViewport'
import { Line } from '../../../../shared-utils/geometry/lines'

export interface State extends PerspectiveViewportState {
	lines: { [lineName: string]: Line }
	time: number
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}
