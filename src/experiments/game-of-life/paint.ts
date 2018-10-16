import { addSystem } from 'shared-utils/painterState'
import { events, paint, State } from './context'

const ctx = paint.getContext('2d')
if (!ctx) throw Error('unable to initialize 2d context')

const data = ctx.getImageData(0, 0, paint.width, paint.height)

for (let i = 0; i < data.data.length; i += 4) {
	data.data[i] = Math.random() > 0.5 ? 255 : 0
	data.data[i + 3] = 255
}

ctx.putImageData(data, 0, 0)

ctx.fillStyle = 'white'
addSystem<State>('paint', (e, s) => {
	if (e === events.CLEANUP_PAINT) {
		ctx.fillStyle = 'black'
		ctx.fillRect(0, 0, paint.width, paint.height)
	}

	const d = s.device
	if (e === events.PROCESS_PAINT && d.mouse.dragging && d.mouse.drag.event) {
		const { clientX, clientY } = d.mouse.drag.event
		const x = Math.floor((clientX / window.innerWidth) * paint.width)
		const y = Math.floor((clientY / window.innerHeight) * paint.height)
		ctx.fillStyle = 'white'
		ctx.fillRect(x, y, 1, 1)
	}
})
