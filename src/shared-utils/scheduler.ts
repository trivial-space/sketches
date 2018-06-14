// onNextTick
// schedule actions on next animation frame

let updateOnce: {[id: string]: Function} | null = null
const updateRepeat: {[id: string]: Function} = {}

let willUpdate = false

let uidCounter = 0

let oldTime = 0


function processUpdates (time: number) {
	if (updateOnce) {
		for (const id in updateOnce) {
			updateOnce[id](time)
		}
		updateOnce = null
	}

	let updates = 0
	const tpf = oldTime ? time - oldTime : oldTime
	oldTime = time
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


export function once(fn: Function, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateOnce = updateOnce || {}
	updateOnce[id] = fn

	if (!willUpdate) {
		requestAnimationFrame(processUpdates)
		willUpdate = true
	}
}


export function repeat(fn: Function, id?: string | number) {
	id = id || fn.name || uidCounter++
	updateRepeat[id] = fn

	if (!willUpdate) {
		requestAnimationFrame(processUpdates)
		willUpdate = true
	}

	return id
}


export function stop(id: Function | string | number) {
	if (typeof id === 'function') {
		id = id.name
	}
	delete updateRepeat[id]
}
