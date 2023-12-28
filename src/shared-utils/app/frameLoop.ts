type Callback = (tpf: number) => void

let updateOnce: { [id: string]: Callback } | null = null
let updateRepeat: { [id: string]: Callback } = {}

let isLoopRunning = false
let uidCounter = 0
let oldTime = 0

function processUpdates() {
	const newTime = performance.now()
	const tpf = oldTime ? newTime - oldTime : 0
	oldTime = newTime

	if (updateOnce) {
		for (const id in updateOnce) {
			updateOnce[id](tpf)
		}
		updateOnce = null
	}

	if (!isLoopRunning) {
		oldTime = 0
		return
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

function runLoop() {
	if (!isLoopRunning) {
		requestAnimationFrame(processUpdates)
		isLoopRunning = true
	}
}

export function stopLoop() {
	isLoopRunning = false
}

export function onNextFrame(fn: Callback, id?: string | number) {
	id = id || fn.name || uidCounter++
	const startAnimation = !updateOnce && !isLoopRunning
	updateOnce = updateOnce || {}
	updateOnce[id] = fn
	startAnimation && requestAnimationFrame(processUpdates)
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

export function startLoop(
	loopToggleKey: KeyboardEvent['key'] | null | false = ' ',
) {
	if (loopToggleKey) initKeyboardLoopToggle(loopToggleKey)
	runLoop()
}

export function clearLoop() {
	updateRepeat = {}
}

// toggle loop with keyboard

let toggleKey: KeyboardEvent['key']
function keyboardToggle(e: KeyboardEvent) {
	if (e.key === toggleKey) {
		if (isLoopRunning) stopLoop()
		else runLoop()
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

if (import.meta.hot) {
	import.meta.hot.dispose(() => {
		removeKeyboardLoopToggle()
		stopLoop()
	})
}
