import {
	getPainterContext,
	baseEvents,
} from '../../../../shared-utils/app/painterState'
import { Line } from '../../../../shared-utils/geometry/lines_3d'
import { PerspectiveViewportState } from '../../../../shared-utils/vr/perspectiveViewport'

export interface State extends PerspectiveViewportState {
	lines: { [lineName: string]: Line }
	time: number
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}

// if (import.meta.hot) {
// 	import.meta.hot.accept()
// }
