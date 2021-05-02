// onNextTick
// schedule actions on next animation frame

type Callback = (tpf: number) => void

let updateOnce: { [id: string]: Callback } | null = null
const updateRepeat: { [id: string]: Callback } = {}

let willUpdate = false

let uidCounter = 0

let oldTime = 0

function processUpdates(time: number) {
	const tpf = oldTime ? time - oldTime : oldTime
	oldTime = time

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
		willUpdate = false
		oldTime = 0
	} else {
		requestAnimationFrame(processUpdates)
	}
}

export function once(fn: Callback, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateOnce = updateOnce || {}
	updateOnce[id] = fn

	if (!willUpdate) {
		requestAnimationFrame(processUpdates)
		willUpdate = true
	}
}

export function repeat(fn: Callback, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateRepeat[id] = fn

	if (!willUpdate) {
		requestAnimationFrame(processUpdates)
		willUpdate = true
	}

	return id
}

export function stop(id: Callback | string | number) {
	if (typeof id === 'function') {
		id = id.name
	}
	delete updateRepeat[id]
}
