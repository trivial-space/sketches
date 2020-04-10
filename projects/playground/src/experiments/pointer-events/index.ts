import { pointer } from 'tvs-libs/dist/events/pointer'

const code = document.getElementById('pointer-event-state')
if (code) {
	pointer({ enableRightButton: true }, val => {
		code.innerHTML = JSON.stringify(val, null, '   ')
	})
}
