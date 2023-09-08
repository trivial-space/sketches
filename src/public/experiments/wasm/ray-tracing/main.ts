import init, { render, setup } from './crate/pkg/tvs_sketch_ray_tracing'

init().then(() => {
	setup()

	const width = 400
	const height = 300

	const canvas = document.getElementById('canvas') as HTMLCanvasElement
	canvas.width = width
	canvas.height = height
	canvas.style.width = `${width * 2}px`
	canvas.style.height = `${height * 2}px`
	canvas.style.backgroundColor = 'black'
	const ctx = canvas.getContext('2d')!

	const div = document.createElement('div')
	div.innerHTML = 'rendering...'
	document.body.appendChild(div)

	setTimeout(() => {
		const timeBefore = performance.now()
		const buffer = render(width, height)
		const timeAfter = performance.now()

		const data = new ImageData(width, height)
		data.data.set(buffer)

		ctx.putImageData(data, 0, 0)

		div.innerHTML = `done! render time: ${timeAfter - timeBefore}ms`
	}, 100)
})

// if (import.meta.hot) {
// 	import.meta.hot.accept()
// }
