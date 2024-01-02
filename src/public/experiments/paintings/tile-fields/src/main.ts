import { mat4 } from 'gl-matrix'
import { addToLoop, startLoop } from '../../../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../../../shared-utils/app/painterState'
import '../../../../../shared-utils/css/fullscreen.css'
import { initCamera } from '../../../../../shared-utils/vr/wasmCamera'
import {
	WasmGeometry,
	wasmGeometryToFormData,
} from '../../../../../shared-utils/wasm/utils'
import init, {
	reset_camera,
	setup,
	update_camera,
	update_screen,
	get_frame_data,
	get_init_data,
} from '../crate/pkg/tvs_sketch_tile_fields'
import { Q } from './context'
import { WasmTileData, setupPainting } from './render_paintings'
import { canvasShader, wallShader } from './shader'

Q.state.device.sizeMultiplier = window.devicePixelRatio

interface PaintingData {
	width: number
	height: number
	tiles: WasmTileData[]
	canvas_geometry: WasmGeometry
	mat: number[]
}

interface InitialData {
	paintings: PaintingData[]
	wall_geometry: WasmGeometry
	ground_geometry: WasmGeometry
	ceil_mat: number[]
}

const canvasShade = Q.getShade('canvas').update(canvasShader)

const wallShade = Q.getShade('wall').update(wallShader)

init().then(() => {
	setup()

	const data: InitialData = get_init_data(6)

	initCamera(Q, {
		resetCamera: reset_camera,
		updateScreen: update_screen,
		updateTransform: update_camera,
		moveSpeed: 2.5,
	})
	Q.emit(baseEvents.RESIZE)

	const ps = data.paintings

	const canvasForms = ps.map((d, i) =>
		Q.getForm('canvas' + i).update(wasmGeometryToFormData(d.canvas_geometry)),
	)

	const paintingLayers = ps.map((d, i) =>
		setupPainting(i, d.width, d.height, d.tiles),
	)

	const canvasSketches = canvasForms.map((form, i) =>
		Q.getSketch('canvas' + i).update({
			form,
			shade: canvasShade,
			uniforms: {
				modelMat: ps[i].mat,
				painting: () => paintingLayers[i].image(),
			},
		}),
	)

	console.log(canvasSketches)

	const wallForm = Q.getForm('wall').update(
		wasmGeometryToFormData(data.wall_geometry),
	)

	const wallSketch = Q.getSketch('wall').update({
		form: wallForm,
		shade: wallShade,
		uniforms: ps.map((d) => ({ modelMat: d.mat })),
	})

	const groundForm = Q.getForm('ground').update(
		wasmGeometryToFormData(data.ground_geometry),
	)

	const groundSketch = Q.getSketch('ground').update({
		form: groundForm,
		shade: wallShade,
		uniforms: [{ modelMat: mat4.create() }, { modelMat: data.ceil_mat }],
	})

	const renderLayer = Q.getLayer('render').update({
		sketches: [...canvasSketches, wallSketch, groundSketch],
		// sketches: canvasSketches,
		drawSettings: {
			enable: [Q.gl.DEPTH_TEST],
			clearBits: Q.gl.COLOR_BUFFER_BIT | Q.gl.DEPTH_BUFFER_BIT,
			clearColor: [0.9, 0.9, 0.9, 1],
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

		Q.painter.compose(renderLayer).show(renderLayer)
	}, 'render')

	startLoop()
})
