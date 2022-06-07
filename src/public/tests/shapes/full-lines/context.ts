import { PerspectiveViewportState } from '../../../../shared-utils/vr/perspectiveViewport'
import { Line } from '../../../../shared-utils/geometry/lines_3d'
import { getPainterContext, baseEvents } from 'tvs-utils/dist/app/painterState'

export interface State extends PerspectiveViewportState {
	lines: { [lineName: string]: Line }
	time: number
}

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<State>(canvas)

export const events = {
	...baseEvents,
}
