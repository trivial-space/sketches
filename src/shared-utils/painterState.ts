import { Layer } from 'tvs-painter'
import { Form } from 'tvs-painter/dist/lib/form'
import { Painter } from 'tvs-painter/dist/lib/painter'
import { Shade } from 'tvs-painter/dist/lib/shade'
import { Sketch } from 'tvs-painter/dist/lib/sketch'
import { getContext } from 'tvs-painter/dist/lib/utils/context'
import { MouseState } from 'tvs-libs/dist/lib/events/mouse'
import { KeyState } from 'tvs-libs/dist/lib/events/keyboard'
import { keyboard } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize } from 'tvs-libs/dist/lib/events/dom'
import { once } from 'shared-utils/scheduler'


// === Painter ===

let currentCanvas: HTMLCanvasElement
let painter: Painter

export function getPainter(canvas: HTMLCanvasElement) {
	init(canvas)
	return painter
}

const forms: {[id: string]: Form} = {}
export function getForm(painter: Painter, id: string) {
	return forms[id] || (forms[id] = painter.createForm())
}

const shades: {[id: string]: Shade} = {}
export function getShade(painter: Painter, id: string) {
	return shades[id] || (shades[id] = painter.createShade())
}

const sketches: {[id: string]: Sketch} = {}
export function getSketch(painter: Painter, id: string) {
	return sketches[id] || (sketches[id] = painter.createSketch())
}

const drawingLayers: {[id: string]: Layer} = {}
export function getDrawingLayer(painter: Painter, id: string) {
	return drawingLayers[id] = (drawingLayers[id] = painter.createDrawingLayer())
}

const staticLayers: {[id: string]: Layer} = {}
export function getStaticLayer(painter: Painter, id: string) {
	return staticLayers[id] = (staticLayers[id] = painter.createStaticLayer())
}

const effectLayers: {[id: string]: Layer} = {}
export function getEffectLayer(painter: Painter, id: string) {
	return effectLayers[id] = (effectLayers[id] = painter.createEffectLayer())
}


// === State ===

export interface BaseState {
	device: {
		canvas: HTMLCanvasElement,
		mouse: MouseState,
		keys: KeyState,
		tpf: number
	}
}

export const state: BaseState = {
	device: {
		tpf: 0
	}
} as BaseState
window['state'] = state

export function get<S extends BaseState = BaseState, K extends keyof S = keyof S>(prop: K): S[K] {
	return (state as S)[prop]
}

export function set<S extends BaseState = BaseState, K extends keyof S = keyof S>(key: K, val: S[K]) {
	(state as S)[key] = val
}

export function getState<S extends BaseState>() {
	return state as S
}


// === Systems ===

type System<S extends BaseState = BaseState> = (event: string, state: S) => void
const systems: {[id: string]: System<any>} = {}

export function addSystem<S extends BaseState = BaseState>(id: string, s: System<S>) {
	systems[id] = s
}

export function dispatch(event: string) {
	for (const k in systems) {
		systems[k](event, state)
	}
}

export const baseEvents = {
	FRAME: 'frame',
	RESIZE: 'resize'
}

// === Init ===

let cancelWindow: () => void
let cancelMouse: () => void
let cancelKeys: () => void

export function init (canvas: HTMLCanvasElement) {
	if (canvas !== currentCanvas) {
		currentCanvas = canvas

		painter = new Painter(getContext(canvas))

		state.device.canvas = canvas

		cancelWindow && cancelWindow()
		cancelMouse && cancelMouse()
		cancelKeys && cancelKeys()

		cancelWindow = windowSize(() => once(() => {
			painter.resize()
			dispatch(baseEvents.RESIZE)
		}, 'resize'))

		cancelMouse = mouse(
			{ element: canvas, enableRightButton: true },
			m => state.device.mouse = m
		)

		cancelKeys = keyboard(k => state.device.keys = k)
	}
}
