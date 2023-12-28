export enum KeyboardCode {
	Escape = 'Escape',
	Digit1 = 'Digit1',
	Digit2 = 'Digit2',
	Digit3 = 'Digit3',
	Digit4 = 'Digit4',
	Digit5 = 'Digit5',
	Digit6 = 'Digit6',
	Digit7 = 'Digit7',
	Digit8 = 'Digit8',
	Digit9 = 'Digit9',
	Digit0 = 'Digit0',
	Minus = 'Minus',
	Equal = 'Equal',
	Backspace = 'Backspace',
	Tab = 'Tab',
	KeyQ = 'KeyQ',
	KeyW = 'KeyW',
	KeyE = 'KeyE',
	KeyR = 'KeyR',
	KeyT = 'KeyT',
	KeyY = 'KeyY',
	KeyU = 'KeyU',
	KeyI = 'KeyI',
	KeyO = 'KeyO',
	KeyP = 'KeyP',
	BracketLeft = 'BracketLeft',
	BracketRight = 'BracketRight',
	Enter = 'Enter',
	ControlLeft = 'ControlLeft',
	KeyA = 'KeyA',
	KeyS = 'KeyS',
	KeyD = 'KeyD',
	KeyF = 'KeyF',
	KeyG = 'KeyG',
	KeyH = 'KeyH',
	KeyJ = 'KeyJ',
	KeyK = 'KeyK',
	KeyL = 'KeyL',
	Semicolon = 'Semicolon',
	Quote = 'Quote',
	Backquote = 'Backquote',
	ShiftLeft = 'ShiftLeft',
	Backslash = 'Backslash',
	KeyZ = 'KeyZ',
	KeyX = 'KeyX',
	KeyC = 'KeyC',
	KeyV = 'KeyV',
	KeyB = 'KeyB',
	KeyN = 'KeyN',
	KeyM = 'KeyM',
	Comma = 'Comma',
	Period = 'Period',
	Slash = 'Slash',
	ShiftRight = 'ShiftRight',
	NumpadMultiply = 'NumpadMultiply',
	AltLeft = 'AltLeft',
	Space = 'Space',
	CapsLock = 'CapsLock',
	F1 = 'F1',
	F2 = 'F2',
	F3 = 'F3',
	F4 = 'F4',
	F5 = 'F5',
	F6 = 'F6',
	F7 = 'F7',
	F8 = 'F8',
	F9 = 'F9',
	F10 = 'F10',
	NumLock = 'NumLock',
	ScrollLock = 'ScrollLock',
	Numpad7 = 'Numpad7',
	Numpad8 = 'Numpad8',
	Numpad9 = 'Numpad9',
	NumpadSubtract = 'NumpadSubtract',
	Numpad4 = 'Numpad4',
	Numpad5 = 'Numpad5',
	Numpad6 = 'Numpad6',
	NumpadAdd = 'NumpadAdd',
	Numpad1 = 'Numpad1',
	Numpad2 = 'Numpad2',
	Numpad3 = 'Numpad3',
	Numpad0 = 'Numpad0',
	NumpadDecimal = 'NumpadDecimal',
	IntlBackslash = 'IntlBackslash',
	F11 = 'F11',
	F12 = 'F12',
	IntlRo = 'IntlRo',
	Convert = 'Convert',
	KanaMode = 'KanaMode',
	NonConvert = 'NonConvert',
	NumpadEnter = 'NumpadEnter',
	ControlRight = 'ControlRight',
	NumpadDivide = 'NumpadDivide',
	PrintScreen = 'PrintScreen',
	AltRight = 'AltRight',
	Home = 'Home',
	ArrowUp = 'ArrowUp',
	PageUp = 'PageUp',
	ArrowLeft = 'ArrowLeft',
	ArrowRight = 'ArrowRight',
	End = 'End',
	ArrowDown = 'ArrowDown',
	PageDown = 'PageDown',
	Insert = 'Insert',
	Delete = 'Delete',
	NumpadEqual = 'NumpadEqual',
	Pause = 'Pause',
	NumpadComma = 'NumpadComma',
}

export type KeyState = {
	codes: Record<KeyboardCode, number>
	keys: Record<string, number>
}

function emptyState(): KeyState {
	return { codes: {}, keys: {} } as KeyState
}

export interface KeyboardOptions {
	element?: HTMLElement | Window
	keepDefault?: boolean
	propagate?: boolean
}

export function keyboard(
	callback: (val: KeyState) => void,
	opts?: KeyboardOptions,
): () => void {
	const { element = window, keepDefault = true, propagate = true } = opts || {}

	const pressed: KeyState = emptyState()

	function onKeydown(event: KeyboardEvent) {
		if (event.defaultPrevented) {
			return
		}

		const time = Date.now()
		pressed.codes[event.code as KeyboardCode] = time
		pressed.keys[event.key] = time
		callback(pressed)

		if (event.code !== KeyboardCode.Tab) {
			if (!keepDefault) {
				event.preventDefault()
			}
			if (!propagate) {
				event.stopPropagation()
			}
		}
	}

	function onKeyup(event: KeyboardEvent) {
		delete pressed.codes[event.code as KeyboardCode]
		delete pressed.keys[event.key]
		callback(pressed)

		if (event.code !== KeyboardCode.Tab) {
			if (!keepDefault) {
				event.preventDefault()
			}
			if (!propagate) {
				event.stopPropagation()
			}
		}
	}

	element.addEventListener('keyup', onKeyup as EventListener)
	element.addEventListener('keydown', onKeydown as EventListener)

	callback(pressed)

	return function stop() {
		element.removeEventListener('keyup', onKeyup as EventListener)
		element.removeEventListener('keydown', onKeydown as EventListener)
	}
}
