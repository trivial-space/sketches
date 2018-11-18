import { once } from 'shared-utils/scheduler'
import { windowSize } from 'tvs-libs/dist/events/dom'
import { keyboard, KeyState } from 'tvs-libs/dist/events/keyboard'
import { mouse, MouseState } from 'tvs-libs/dist/events/mouse'
import { deepOverride } from 'tvs-libs/dist/utils/object'
import { Form } from 'tvs-painter/dist/lib/form'
import { DrawingLayer, StaticLayer } from 'tvs-painter/dist/lib/layer'
import { Painter } from 'tvs-painter/dist/lib/painter'
import { Shade } from 'tvs-painter/dist/lib/shade'
import { Sketch } from 'tvs-painter/dist/lib/sketch'
import { getContext } from 'tvs-painter/dist/lib/utils/context'

// === Painter ===

let currentCanvas: HTMLCanvasElement
let painter: Painter

export function getPainter(canvas: HTMLCanvasElement) {
	init(canvas)
	return painter
}

const forms: { [id: string]: Form } = {}
export function getForm(painter: Painter, id: string) {
	return forms[id] || (forms[id] = painter.createForm('Form_' + id))
}

const shades: { [id: string]: Shade } = {}
export function getShade(painter: Painter, id: string) {
	return shades[id] || (shades[id] = painter.createShade('Shade_' + id))
}

const sketches: { [id: string]: Sketch } = {}
export function getSketch(painter: Painter, id: string) {
	return sketches[id] || (sketches[id] = painter.createSketch('Sketch_' + id))
}

const drawingLayers: { [id: string]: DrawingLayer } = {}
export function getDrawingLayer(painter: Painter, id: string) {
	return (
		drawingLayers[id] ||
		(drawingLayers[id] = painter.createDrawingLayer('DrawLayer_' + id))
	)
}

const staticLayers: { [id: string]: StaticLayer } = {}
export function getStaticLayer(painter: Painter, id: string) {
	return (
		staticLayers[id] ||
		(staticLayers[id] = painter.createStaticLayer('StaticLayer_' + id))
	)
}

const effectLayers: { [id: string]: DrawingLayer } = {}
export function getEffectLayer(painter: Painter, id: string) {
	return (
		effectLayers[id] ||
		(effectLayers[id] = painter.createEffectLayer('EffectLayer_' + id))
	)
}

// === State ===

export interface BaseState {
	device: {
		tpf: number
		canvas: HTMLCanvasElement
		mouse: MouseState
		keys: KeyState
		sizeMultiplier: number
		keepCanvasSize?: boolean
	}
}

export const state: BaseState = {
	device: {
		tpf: 0,
		sizeMultiplier: 1,
	},
} as BaseState
;(window as any).state = state

export function get<
	S extends BaseState = BaseState,
	K extends keyof S = keyof S
>(prop: K): S[K] {
	return (state as S)[prop]
}

export function set<
	S extends BaseState = BaseState,
	K extends keyof S = keyof S
>(key: K, val: S[K], opts?: { reset: any }) {
	const s = state as S
	if (s[key]) {
		const reset = opts && opts.reset
		if (reset !== true) {
			val = deepOverride(val, s[key], { ignore: reset })
		}
	}
	s[key] = val
}

export function getState<S extends BaseState>() {
	return state as S
}

// === Systems ===

type ActionHandler<S extends BaseState = BaseState> = (
	event: string,
	state: S,
) => void
const systems: { [id: string]: ActionHandler<any> } = {}

export function addSystem<S extends BaseState = BaseState>(
	id: string,
	s: ActionHandler<S>,
) {
	systems[id] = s
}

export function dispatch(event: string) {
	for (const k in systems) {
		systems[k](event, state)
	}
}

export const baseEvents = {
	FRAME: 'frame',
	RESIZE: 'resize',
}

// === Init ===

let cancelWindow: () => void
let cancelMouse: () => void
let cancelKeys: () => void

export function init(canvas: HTMLCanvasElement) {
	if (canvas !== currentCanvas) {
		currentCanvas = canvas

		painter = new Painter(getContext(canvas))

		state.device.canvas = canvas

		cancelWindow && cancelWindow()
		cancelMouse && cancelMouse()
		cancelKeys && cancelKeys()

		cancelWindow = windowSize(() =>
			once(() => {
				painter.resize({
					multiplier: state.device.sizeMultiplier,
					keepCurrentSize: state.device.keepCanvasSize,
				})
				dispatch(baseEvents.RESIZE)
			}, 'resize'),
		)

		cancelMouse = mouse(
			{ element: canvas, enableRightButton: true },
			m => (state.device.mouse = m),
		)

		cancelKeys = keyboard(k => (state.device.keys = k))
	}
}
