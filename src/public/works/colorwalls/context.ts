import { getPainterContext, baseEvents } from 'tvs-utils/dist/app/painterState'
import { PerspectiveViewportState } from '../../../shared-utils/vr/perspectiveViewport'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext<PerspectiveViewportState>(canvas)

export const events = {
	...baseEvents,
}

if (import.meta.hot) {
	import.meta.hot.accept()
}
