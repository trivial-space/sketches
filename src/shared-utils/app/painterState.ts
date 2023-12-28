import { deepOverride } from 'tvs-libs/dist/utils/object'
import { GL, PainterOptions } from 'tvs-painter'
import { Form } from 'tvs-painter/dist/form'
import { Layer } from 'tvs-painter/dist/layer'
import { Painter } from 'tvs-painter/dist/painter'
import { Shade } from 'tvs-painter/dist/shade'
import { Effect, Sketch } from 'tvs-painter/dist/sketch'
import { addToLoop, onNextFrame } from './frameLoop'
import { PointerState, pointer } from '../events/pointer'
import { KeyState, keyboard } from '../events/keyboard'
import { windowSize } from '../events/dom'

// === Painter ===

let currentCanvas: HTMLCanvasElement
let painter: Painter

const forms: { [id: string]: Form } = {}
function getForm(id: string) {
	return forms[id] || (forms[id] = painter.createForm('Form_' + id))
}

const shades: { [id: string]: Shade } = {}
function getShade(id: string) {
	return shades[id] || (shades[id] = painter.createShade('Shade_' + id))
}

const sketches: { [id: string]: Sketch } = {}
function getSketch(id: string) {
	return sketches[id] || (sketches[id] = painter.createSketch('Sketch_' + id))
}

const layers: { [id: string]: Layer } = {}
function getLayer(id: string) {
	return layers[id] || (layers[id] = painter.createLayer('Layer_' + id))
}

const effects: { [id: string]: Effect } = {}
function getEffect(id: string) {
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
	}
}

const state: BaseState = {
	device: {
		tpf: 0,
		sizeMultiplier: 1,
	},
} as BaseState
;(window as any).state = state

// === Events ===

type ActionHandler<S extends BaseState = BaseState> = (state: S) => void

const eventHandlers: {
	[event: string]: { [id: string]: ActionHandler<any> }
} = {}

export const baseEvents = {
	FRAME: 'frame',
	RESIZE: 'resize',
	POINTER: 'pointer',
	KEYBOARD: 'keyboard',
} as const

// === Context ===

let cancelWindow: () => void
let cancelPointer: () => void
let cancelKeys: () => void

export interface EventOpts {
	keepPointerDefault?: boolean
	propagatePointer?: boolean
}

export function getPainterContext<S extends BaseState>(
	canvas: HTMLCanvasElement,
	options?: PainterOptions & EventOpts,
): PainterContext<S> {
	const { keepPointerDefault, propagatePointer, ...opts } = options || {}
	if (canvas !== currentCanvas) {
		currentCanvas = canvas

		painter = new Painter(canvas, opts)

		state.device.canvas = canvas

		cancelWindow && cancelWindow()
		cancelPointer && cancelPointer()
		cancelKeys && cancelKeys()

		cancelWindow = windowSize(() =>
			onNextFrame(() => {
				painter.sizeMultiplier = state.device.sizeMultiplier
				painter.resize()
				emit(baseEvents.RESIZE)
			}, 'painter-ctx-resize'),
		)

		cancelPointer = pointer(
			(m) => {
				state.device.pointer = m
				emit(baseEvents.POINTER)
			},
			{
				element: canvas,
				enableRightButton: true,
				holdRadius: 7,
				holdDelay: 250,
				keepDefault: keepPointerDefault,
				propagate: propagatePointer,
			},
		)

		cancelKeys = keyboard((k) => {
			state.device.keys = k
			emit(baseEvents.KEYBOARD)
		})

		addToLoop((tpf) => {
			state.device.tpf = tpf
		}, 'painter-ctx-tpf')
	}

	return {
		painter,
		gl: painter.gl,
		getForm,
		getShade,
		getSketch,
		getLayer,
		getEffect,

		state: state as S,

		get,
		set,
		listen,
		emit,
	}

	function get<K extends keyof S = keyof S>(prop: K): S[K] {
		return (state as S)[prop]
	}

	function set<K extends keyof S = keyof S>(
		key: K,
		val: S[K],
		opts?: { reset: any },
	) {
		const s = state as S
		if (s[key]) {
			const reset = opts && opts.reset
			if (reset !== true) {
				val = deepOverride(val, s[key] as any, { ignore: reset }) as S[K]
			}
		}
		s[key] = val
	}

	function listen(id: string, event: string, s: ActionHandler<S>) {
		if (!eventHandlers[event]) eventHandlers[event] = {}
		eventHandlers[event][id] = s
	}

	function emit(event: string) {
		const e = eventHandlers[event]
		if (e)
			for (const id in e) {
				e[id](state as S)
			}
	}
}

export interface PainterContext<S extends BaseState = BaseState> {
	painter: Painter
	gl: GL
	getForm: typeof getForm
	getShade: typeof getShade
	getSketch: typeof getSketch
	getLayer: typeof getLayer
	getEffect: typeof getEffect
	state: S
	get<K extends keyof S = keyof S>(prop: K): S[K]
	set<K extends keyof S = keyof S>(
		key: K,
		val: S[K],
		opts?: { reset: any },
	): void
	listen(id: string, event: string, s: ActionHandler<S>): void
	emit(event: string): void
}
