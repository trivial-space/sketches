import '../../../shared-utils/css/fullscreen.css'
import { addToLoop, startLoop } from '../../../shared-utils/app/frameLoop'
import { baseEvents } from '../../../shared-utils/app/painterState'
import { createPoints2DSketch } from '../../../shared-utils/sketches/points/points'
import { initCamera } from '../../../shared-utils/vr/wasmCamera'
import { wasmGeometryToFormData } from '../../../shared-utils/wasm/utils'
import { Q } from './context'
import init, {
	get_init_data,
	reset_camera,
	setup,
	update,
	update_camera,
	update_screen,
} from './crate/pkg/tvs_sketch_squeegee'
import { brushShader, diffuseFrag, plateShader } from './shaders'

const BRUSH_LAYER_SIZE = [1024, 2048] as const

Q.state.device.sizeMultiplier = window.devicePixelRatio

const points = createPoints2DSketch(Q, 'points1', {
	dynamicForm: true,
	pointSize: 40,
	width: BRUSH_LAYER_SIZE[0],
	height: BRUSH_LAYER_SIZE[1],
})

const brushShade = Q.getShade('brush').update(brushShader)
const brushForm = Q.getForm('brush')
const brushSketch = Q.getSketch('brush').update({
	form: brushForm,
	shade: brushShade,
})

const brushLayer = Q.getLayer('brush').update({
	// sketches: [brushSketch, points.sketch],
	sketches: [brushSketch],
	width: BRUSH_LAYER_SIZE[0],
	height: BRUSH_LAYER_SIZE[1],
	antialias: false,
	drawSettings: {
		enable: [Q.gl.BLEND],
		clearBits: Q.gl.COLOR_BUFFER_BIT,
		clearColor: [0, 0, 0, 0],
		blendEquationSeparate: [Q.gl.FUNC_ADD, Q.gl.MAX],
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.SRC_ALPHA,
			Q.gl.DST_ALPHA,
		],
	},
})

const diffuseEffect = Q.getEffect('diffuse').update({
	frag: diffuseFrag,
	uniforms: { source: '0', brush: () => brushLayer.image() },
})

const diffuseLayer = Q.getLayer('diffuse').update({
	width: BRUSH_LAYER_SIZE[0],
	height: BRUSH_LAYER_SIZE[1],
	selfReferencing: true,
	sketches: diffuseEffect,
	bufferType: 'FLOAT',
})

// scene setup

const plateShade = Q.getShade('plate').update(plateShader)
const plateForm = Q.getForm('plate')
const plateSketch = Q.getSketch('plate').update({
	form: plateForm,
	shade: plateShade,
	uniforms: {
		tex: () => diffuseLayer.image(),
	},
})

const sceneLayer = Q.getLayer('scene').update({
	sketches: [plateSketch],
	drawSettings: {
		clearBits: Q.gl.COLOR_BUFFER_BIT | Q.gl.DEPTH_BUFFER_BIT,
		clearColor: [0.5, 0.5, 0.5, 1],
		enable: [Q.gl.BLEND, Q.gl.DEPTH_TEST],
	},
})

init().then(() => {
	setup(...BRUSH_LAYER_SIZE)

	initCamera(Q, {
		updateScreen: update_screen,
		updateTransform: update_camera,
		resetCamera: reset_camera,
		moveSpeed: 100.5,
	})
	Q.emit(baseEvents.RESIZE)

	const initData = get_init_data()

	plateForm.update(wasmGeometryToFormData(initData.plate_geom))

	console.log(initData)

	addToLoop((tpf) => {
		// for camera
		Q.emit(baseEvents.FRAME)

		const data = update(tpf / 1000)

		points.update({
			positions: [data.gravity_center, data.puller_pos, data.brush_pos],
			colors: [
				[0, 1, 0, 1],
				[1, 0, 0, 1],
				[0, 0, 1, 1],
			],
		})

		brushSketch.update({
			form: brushForm.update(
				wasmGeometryToFormData(data.brush_geometry, 'DYNAMIC'),
			),
			uniforms: {
				size: BRUSH_LAYER_SIZE,
			},
		})

		sceneLayer.update({
			uniforms: {
				view: data.view_mat,
				proj: data.proj_mat,
			},
		})

		Q.painter.compose(brushLayer, diffuseLayer, sceneLayer).show(sceneLayer)
	}, 'loop')

	startLoop()
})
