import { getPainterContext, baseEvents } from 'tvs-utils/dist/app/painterState'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const Q = getPainterContext(canvas)

export const events = {
	...baseEvents,
}
