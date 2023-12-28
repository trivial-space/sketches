import {
	baseEvents,
	getPainterContext,
} from '../../../shared-utils/app/painterState'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement
export const paint = document.getElementById('paint') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

export const events = {
	...baseEvents,
	PROCESS_PAINT: 'process_paint',
	CLEANUP_PAINT: 'cleanup_paint',
}
