import init, {
	render,
	setup,
} from './crate/pkg/tvs_sketch_ray_tracing'

init().then(() => {
	setup()

	const width = 800
	const height = 600

	const canvas = document.getElementById('canvas') as HTMLCanvasElement
	canvas.width = width
	canvas.height = height
	const ctx = canvas.getContext('2d')!

	const buffer = render(width, height)
	const data = new ImageData(width, height)
	data.data.set(buffer)

	ctx.putImageData(data, 0, 0)
})

// if (import.meta.hot) {
// 	import.meta.hot.accept()
// }
