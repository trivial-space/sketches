import { events, paint, Q } from './context'

const ctx = paint.getContext('2d')
if (!ctx) throw Error('unable to initialize 2d context')

const data = ctx.getImageData(0, 0, paint.width, paint.height)

for (let i = 0; i < data.data.length; i += 4) {
	data.data[i] = Math.random() > 0.5 ? 255 : 0
	data.data[i + 3] = 255
}

ctx.putImageData(data, 0, 0)

Q.listen('paint', events.CLEANUP_PAINT, (s) => {
	ctx.fillStyle = 'black'
	ctx.fillRect(0, 0, paint.width, paint.height)
})

Q.listen('paint', events.PROCESS_PAINT, ({ device: d }) => {
	if (d.pointer.dragging && d.pointer.drag.event) {
		const { clientX, clientY } = d.pointer.drag.event
		const x = Math.floor((clientX / window.innerWidth) * paint.width)
		const y = Math.floor((clientY / window.innerHeight) * paint.height)
		ctx.fillStyle = 'white'
		ctx.fillRect(x, y, 1, 1)
	}
})
