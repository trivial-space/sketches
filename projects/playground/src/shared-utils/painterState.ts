import { once } from './scheduler'
import { windowSize } from 'tvs-libs/dist/events/dom'
import { keyboard, KeyState } from 'tvs-libs/dist/events/keyboard'
import { deepOverride } from 'tvs-libs/dist/utils/object'
import { PainterOptions } from 'tvs-painter'
import { Form } from 'tvs-painter/dist/form'
import { Frame } from 'tvs-painter/dist/frame'
import { Layer } from 'tvs-painter/dist/layer'
import { Painter } from 'tvs-painter/dist/painter'
import { Shade } from 'tvs-painter/dist/shade'
import { Sketch } from 'tvs-painter/dist/sketch'
import { PointerState, pointer } from 'tvs-libs/dist/events/pointer'

// === Painter ===

let currentCanvas: HTMLCanvasElement
let painter: Painter

export function getPainter(canvas: HTMLCanvasElement, opts?: PainterOptions) {
	init(canvas, opts)
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

const layers: { [id: string]: Layer } = {}
export function getLayer(painter: Painter, id: string) {
	return layers[id] || (layers[id] = painter.createLayer('Layer_' + id))
}

const frames: { [id: string]: Frame } = {}
export function getFrame(painter: Painter, id: string) {
	return frames[id] || (frames[id] = painter.createFrame('Frame_' + id))
}

const effects: { [id: string]: Layer } = {}
export function getEffect(painter: Painter, id: string) {
	return effects[id] || (effects[id] = painter.createEffect('Effect_' + id))
}

// === State ===

export interface BaseState {
	device: {
		tpf: number
		canvas: HTMLCanvasElement
		pointer: PointerState
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
let cancelPointer: () => void
let cancelKeys: () => void

export function init(canvas: HTMLCanvasElement, opts?: PainterOptions) {
	if (canvas !== currentCanvas) {
		currentCanvas = canvas

		painter = new Painter(canvas, opts)

		state.device.canvas = canvas

		cancelWindow && cancelWindow()
		cancelPointer && cancelPointer()
		cancelKeys && cancelKeys()

		cancelWindow = windowSize(() =>
			once(() => {
				painter.sizeMultiplier = state.device.sizeMultiplier
				painter.resize()
				dispatch(baseEvents.RESIZE)
			}, 'resize'),
		)

		cancelPointer = pointer(
			{ element: canvas, enableRightButton: true },
			m => (state.device.pointer = m),
		)

		cancelKeys = keyboard(k => (state.device.keys = k))
	}
}
