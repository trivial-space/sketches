import { addToLoop, startLoop } from '../../../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../../../shared-utils/app/painterState'
import '../../../../../shared-utils/css/fullscreen.css'
import { initCamera } from '../../../../../shared-utils/vr/wasmCamera'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import { render } from '../../../wasm/balls/src/render'
import init, {
	reset_camera,
	setup,
	update_camera,
	update_screen,
	get_frame_data,
} from '../crate/pkg/tvs_sketch_tile_fields'
import { Q } from './context'
import { WasmTileData, setupPainting } from './render_paintings'
import { canvasShader } from './shader'

Q.state.device.sizeMultiplier = window.devicePixelRatio

interface PaintingData {
	painting: {
		width: number
		height: number
		tiles: WasmTileData[]
	}
	canvas: {
		geometry: WasmGeometry
		mat: number[]
	}
}

const canvasShade = Q.getShade('canvas').update(canvasShader)

init().then(() => {
	const data: PaintingData[] = setup(7)

	initCamera(Q, {
		resetCamera: reset_camera,
		updateScreen: update_screen,
		updateTransform: update_camera,
		moveSpeed: 1.5,
	})
	Q.emit(baseEvents.RESIZE)

	const canvasForms = data.map((d, i) =>
		Q.getForm('canvas' + i).update(wasmGeometryToFormData(d.canvas.geometry)),
	)

	console.log(data[0].painting.tiles)

	const paintings = data.map((d, i) =>
		setupPainting(i, d.painting.width, d.painting.height, d.painting.tiles),
	)

	const canvasSketches = canvasForms.map((form, i) =>
		Q.getSketch('canvas' + i).update({
			form,
			shade: canvasShade,
			uniforms: {
				modelMat: data[i].canvas.mat,
				painting: () => paintings[i].image(),
			},
		}),
	)

	const renderLayer = Q.getLayer('render').update({
		sketches: canvasSketches,
		drawSettings: {
			enable: [Q.gl.DEPTH_TEST],
			clearBits: Q.gl.COLOR_BUFFER_BIT | Q.gl.DEPTH_BUFFER_BIT,
			clearColor: [0, 0, 0, 1],
		},
	})

	addToLoop(() => {
		// for camera
		Q.emit(baseEvents.FRAME)

		const data = get_frame_data()

		renderLayer.update({
			uniforms: {
				viewProjMat: data.camera,
			},
		})

		// Q.painter.compose(renderLayer).show(paintings[0])
		Q.painter.compose(renderLayer).show(renderLayer)
	}, 'render')

	startLoop()
})

if (import.meta.hot) {
	import.meta.hot.accept()
}
