import { pointer } from 'tvs-utils/dist/events/pointer'

const code = document.getElementById('pointer-event-state')
if (code) {
	pointer(
		(val) => {
			code.innerHTML = JSON.stringify(val, null, '   ')
		},
		{ enableRightButton: true },
	)
}

if (import.meta.hot) {
	import.meta.hot.accept()
}
