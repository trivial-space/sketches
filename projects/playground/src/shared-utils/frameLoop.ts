// onNextTick
// schedule actions on next animation frame

type Callback = (tpf: number) => void

let updateOnce: { [id: string]: Callback } | null = null
const updateRepeat: { [id: string]: Callback } = {}

let isLoopRunning = false
let uidCounter = 0
let oldTime = 0

function processUpdates(newTime: number) {
	if (!isLoopRunning) return

	const tpf = oldTime ? newTime - oldTime : oldTime
	oldTime = newTime

	if (updateOnce) {
		for (const id in updateOnce) {
			updateOnce[id](tpf)
		}
		updateOnce = null
	}

	let updates = 0
	for (const id in updateRepeat) {
		updates++
		updateRepeat[id](tpf)
	}

	if (!updates) {
		isLoopRunning = false
		oldTime = 0
	} else {
		requestAnimationFrame(processUpdates)
	}
}

export function startLoop() {
	oldTime = performance.now()
	if (!isLoopRunning) {
		requestAnimationFrame(processUpdates)
	}
	isLoopRunning = true
}

export function stopLoop() {
	isLoopRunning = false
}

export function onNextFrame(fn: Callback, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateOnce = updateOnce || {}
	updateOnce[id] = fn
	return id
}

export function addToLoop(fn: Callback, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateRepeat[id] = fn
	return id
}

export function removeFromLoop(id: Callback | string | number) {
	if (typeof id === 'function') {
		id = id.name
	}
	delete updateRepeat[id]
}

// toggle loop with keyboard

let toggleKey: KeyboardEvent['key']
function keyboardToggle(e: KeyboardEvent) {
	if (e.key === toggleKey) {
		if (isLoopRunning) stopLoop()
		else startLoop()
	}
}

export function initKeyboardLoopToggle(key: KeyboardEvent['key'] = ' ') {
	if (toggleKey) removeKeyboardLoopToggle()
	toggleKey = key
	window.addEventListener('keyup', keyboardToggle)
}

export function removeKeyboardLoopToggle() {
	window.removeEventListener('keyup', keyboardToggle)
}

initKeyboardLoopToggle()
