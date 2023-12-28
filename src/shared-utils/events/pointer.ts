export enum Buttons {
	LEFT = 0,
	MIDDLE = 1,
	RIGHT = 2,
}

export interface PointerState {
	pressed: { [btn: number]: PointerEvent }
	drag: {
		x: number
		y: number
		dX: number
		dY: number
		xMax: number
		yMax: number
		event?: PointerEvent
	}
	dragging: boolean
	holding: boolean
}

export interface PointerOpts {
	element?: HTMLElement
	enableRightButton?: boolean
	holdDelay?: number
	holdRadius?: number
	keepDefault?: boolean
	propagate?: boolean
}

export function pointer(
	callback: (val: PointerState) => void,
	opts?: PointerOpts,
) {
	const {
		element = document,
		enableRightButton,
		holdDelay = 400,
		holdRadius = 5,
		keepDefault,
		propagate,
	} = opts || {}

	const state: PointerState = {
		pressed: {},
		drag: { x: 0, y: 0, dX: 0, dY: 0, xMax: 0, yMax: 0 },
		dragging: false,
		holding: false,
	}

	let x = 0,
		y = 0,
		oX = 0,
		oY = 0,
		timeout: any = null

	function onPointerDown(e: PointerEvent) {
		if (e.isPrimary) {
			state.pressed[e.button] = e
			x = oX = e.clientX
			y = oY = e.clientY
			state.dragging = true
			timeout != null && clearTimeout(timeout)
			timeout = setTimeout(() => {
				if (state.drag.xMax < holdRadius && state.drag.yMax < holdRadius) {
					state.holding = true
					callback(state)
				}
			}, holdDelay)
		} else {
			state.pressed[e.button] = e
			state.pressed[Buttons.RIGHT] = e
		}

		if (!keepDefault) {
			e.preventDefault()
		}
		if (!propagate) {
			e.stopPropagation()
		}
		callback(state)
	}

	function onPointerUp(e: PointerEvent) {
		state.pressed = {}
		delete state.drag.event
		state.drag.x = 0
		state.drag.y = 0
		state.drag.dX = 0
		state.drag.dY = 0
		state.drag.xMax = 0
		state.drag.yMax = 0
		state.dragging = false
		state.holding = false
		timeout != null && clearTimeout(timeout)
		timeout = null
		callback(state)

		if (!propagate) {
			e.stopPropagation()
		}
		if (!keepDefault) {
			e.preventDefault()
		}
	}

	function onPointerMove(e: PointerEvent) {
		if (state.dragging && e.isPrimary) {
			state.drag.event = e

			state.drag.x = x - e.clientX
			state.drag.y = y - e.clientY
			state.drag.dX = oX - e.clientX
			state.drag.dY = oY - e.clientY
			state.drag.xMax = Math.max(Math.abs(state.drag.x), state.drag.xMax)
			state.drag.yMax = Math.max(Math.abs(state.drag.y), state.drag.yMax)

			oX = e.clientX
			oY = e.clientY

			callback(state)

			if (!propagate) {
				e.stopPropagation()
			}
			if (!keepDefault) {
				e.preventDefault()
			}
		}
	}

	function preventDefault(e: Event) {
		e.preventDefault()
	}

	element.addEventListener('pointerdown', onPointerDown as EventListener)
	element.addEventListener('pointermove', onPointerMove as EventListener)
	element.addEventListener('pointerup', onPointerUp as EventListener)
	element.addEventListener('pointerleave', onPointerUp as EventListener)
	element.addEventListener('pointercancel', onPointerUp as EventListener)

	if (enableRightButton) {
		element.addEventListener('contextmenu', preventDefault)
	}

	callback(state)

	return function destroy() {
		element.removeEventListener('pointerdown', onPointerDown as EventListener)
		element.removeEventListener('pointermove', onPointerMove as EventListener)
		element.removeEventListener('pointerup', onPointerUp as EventListener)
		element.removeEventListener('pointerleave', onPointerUp as EventListener)
		element.removeEventListener('pointercancel', onPointerUp as EventListener)
		if (enableRightButton) {
			element.removeEventListener('contextmenu', preventDefault)
		}
	}
}
