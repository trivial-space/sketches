type Callback = (tpf: number) => void

let updateOnce: { [id: string]: Callback } | null = null
let updateRepeat: { [id: string]: Callback } = {}
let hasCallbacks = false

let isLoopRunning = false
let uidCounter = 0
let oldTime = 0

let framesPerSecond = 0
let fpsTimer = 0

function processUpdates() {
	const newTime = performance.now()
	const tpf = oldTime ? newTime - oldTime : 0
	oldTime = newTime

	fpsTimer += tpf
	framesPerSecond += 1
	if (fpsTimer >= 1000) {
		const avg = fpsTimer / framesPerSecond
		console.log('fps', 1000 / avg)
		framesPerSecond = 0
		fpsTimer = 0
	}

	const updateOnceCurrent = updateOnce
	updateOnce = null

	if (updateOnceCurrent) {
		for (const id in updateOnceCurrent) {
			updateOnceCurrent[id](tpf)
		}
	}

	if (!isLoopRunning) {
		oldTime = 0
		return
	}

	if (hasCallbacks) {
		for (const id in updateRepeat) {
			updateRepeat[id](tpf)
		}
		requestAnimationFrame(processUpdates)
	} else {
		isLoopRunning = false
		oldTime = 0
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
	const startAnimation = !updateOnce && !hasCallbacks
	updateOnce = updateOnce || {}
	updateOnce[id] = fn
	startAnimation && requestAnimationFrame(processUpdates)
	return id
}

export function addToLoop(fn: Callback, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateRepeat[id] = fn
	hasCallbacks = true
	return id
}

export function removeFromLoop(id: Callback | string | number) {
	if (typeof id === 'function') {
		id = id.name
	}
	delete updateRepeat[id]
	hasCallbacks = Object.keys(updateRepeat).length > 0
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
