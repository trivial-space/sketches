import {
	addSystem,
	getDrawingLayer,
	getEffectLayer,
	getForm,
	getShade,
	getSketch,
	getStaticLayer,
} from 'shared-utils/painterState'
import { makeClear } from 'tvs-painter/dist/utils/context'
import { plane } from 'tvs-painter/dist/utils/geometry/plane'
import { events, gl, painter, state, State } from './context'
import frag from './shaders/geo-frag.glsl'
import vert from './shaders/geo-vert.glsl'
import lightFrag from './shaders/light-frag.glsl'

// Forms

const geometry = plane(10, 10, 0, 0)
const planeForm = getForm(painter, 'plane').update(geometry)

// Shades

const geoShade = getShade(painter, 'geo').update({
	frag,
	vert,
})

// Textures

const texture = getStaticLayer(painter, 'tex').update({})

const img = new Image()
img.onload = () => {
	texture.update({
		asset: img,
		minFilter: 'LINEAR_MIPMAP_LINEAR',
		magFilter: 'LINEAR',
	})
}
img.src = 'tree.jpg'

// Sketches

const groundSketch = getSketch(painter, 'ground').update({
	form: planeForm,
	shade: geoShade,
	uniforms: {
		transform: () => state.scene.groundTransform,
		color: () => state.scene.groundColor,
	},
})

const lightSketch = getSketch(painter, 'light').update({
	form: planeForm,
	shade: geoShade,
	uniforms: [
		{
			transform: () => state.scene.lightTransforms[0],
			color: () => state.scene.lightColor,
		},
		{
			transform: () => state.scene.lightTransforms[1],
			color: () => state.scene.lightBackColor,
		},
	],
	drawSettings: {
		enable: [gl.CULL_FACE],
	},
})

// Layers

export const sceneLayer = getDrawingLayer(painter, 'scene').update({
	drawSettings: {
		clearBits: makeClear(gl, 'color', 'depth'),
	},
	buffered: true,
	textureConfig: {
		count: 4,
		type: gl.FLOAT,
	},
	sketches: [lightSketch, groundSketch],
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat,
	},
	wrap: 'CLAMP_TO_EDGE',
	minFilter: 'NEAREST',
	magFilter: 'NEAREST',
})

export const lightLayer = getEffectLayer(painter, 'light').update({
	frag: lightFrag,
	uniforms: {
		eyePosition: () => state.viewPort.camera.position,
		lightMat: () => state.scene.lightTransforms[0],
		view: () => state.viewPort.camera.viewMat,
		tex: texture.texture(),
		positions: sceneLayer.texture(0),
		normals: sceneLayer.texture(1),
		uvs: sceneLayer.texture(2),
		colors: sceneLayer.texture(3),
	},
	drawSettings: {
		disable: [gl.DEPTH_TEST],
		enable: [gl.BLEND],
		clearBits: makeClear(gl, 'color'),
	},
})

addSystem<State>('renderer', e => {
	if (e === events.RESIZE) {
		sceneLayer.update({})
	}
})
