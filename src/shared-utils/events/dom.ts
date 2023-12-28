export interface WindowSizeState {
	width: number
	height: number
}

export function windowSize(callback: (s: WindowSizeState) => void) {
	function resize() {
		callback({
			width: window.innerWidth,
			height: window.innerHeight,
		})
	}

	window.addEventListener('resize', resize)

	resize()

	return function stop() {
		window.removeEventListener('resize', resize)
	}
}
