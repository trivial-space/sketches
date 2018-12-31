import { baseEvents, getPainter } from 'shared-utils/painterState'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement
export const paint = document.getElementById('paint') as HTMLCanvasElement

export const painter = getPainter(canvas)

export const gl = painter.gl

export const events = {
	...baseEvents,
	PROCESS_PAINT: 'process_paint',
	CLEANUP_PAINT: 'cleanup_paint',
}
