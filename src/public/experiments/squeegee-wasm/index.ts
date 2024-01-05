import { Q } from './context'
import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import init, { setup, update } from './crate/pkg/tvs_sketch_squeegee'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'

Q.state.device.sizeMultiplier = window.devicePixelRatio

Q.painter.updateDrawSettings({
	clearColor: [1, 1, 1, 1],
	clearBits: makeClear(Q.gl, 'color'),
})

const points = createPoints2DSketch(Q, 'points1', {
	dynamicForm: true,
	pointSize: 40,
})

init().then(() => {
	setup(Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight)

	addToLoop((tpf) => {
		const data = update(tpf / 1000)

		points.update({
			positions: [data.gravity_center, data.puller_pos, data.brush_pos],
			colors: [
				[0, 0, 0, 1],
				[1, 0, 0, 1],
				[0, 0, 1, 1],
			],
		})

		Q.painter.draw({ sketches: points.sketch })
	}, 'loop')

	startLoop()
})
