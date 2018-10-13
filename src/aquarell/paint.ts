import { addSystem } from 'shared-utils/painterState'
import { events, paint, State } from './context'

const ctx = paint.getContext('2d')
if (!ctx) throw Error('unable to initialize 2d context')

const data = ctx.getImageData(0, 0, paint.width, paint.height)

for (let i = 0; i < data.data.length; i += 4) {
	data.data[i] = Math.random() > 0.5 ? 255 : 0
	data.data[i + 3] = 255
}

ctx.fillStyle = 'hsl(30, 0.5, 0.5)'
ctx.fillRect(20, 20, 100, 100)

ctx.putImageData(data, 0, 0)

addSystem<State>('paint', (e, _s) => {
	if (e === events.CLEANUP_PAINT) {
		ctx.clearRect(0, 0, paint.width, paint.height)
	}
})

