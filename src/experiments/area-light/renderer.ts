import {
	addSystem,
	getEffect,
	getForm,
	getFrame,
	getLayer,
	getShade,
	getSketch,
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

const texture = getFrame(painter, 'tex')

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

const sceneLayer = getLayer(painter, 'scene').update({
	sketches: [lightSketch, groundSketch],
	uniforms: {
		view: () => state.viewPort.camera.viewMat,
		projection: () => state.viewPort.camera.projectionMat,
	},
	drawSettings: {
		enable: [gl.DEPTH_TEST],
		clearBits: makeClear(gl, 'color', 'depth'),
	},
})

export const scene = getFrame(painter, 'scene').update({
	layers: sceneLayer,
	bufferStructure: ['FLOAT', 'FLOAT', 'FLOAT', 'FLOAT'],
	wrap: 'CLAMP_TO_EDGE',
	minFilter: 'NEAREST',
	magFilter: 'NEAREST',
})

const lightLayer = getEffect(painter, 'light').update({
	frag: lightFrag,
	uniforms: {
		eyePosition: () => state.viewPort.camera.position,
		lightMat: () => state.scene.lightTransforms[0],
		view: () => state.viewPort.camera.viewMat,
		tex: () => texture.image(),
		positions: scene.image(0),
		normals: scene.image(1),
		uvs: scene.image(2),
		colors: scene.image(3),
	},
	drawSettings: {
		enable: [gl.BLEND],
		clearBits: makeClear(gl, 'color'),
	},
})

export const light = getFrame(painter, 'light').update({
	layers: lightLayer,
})

addSystem<State>('renderer', e => {
	if (e === events.RESIZE) {
		sceneLayer.update({})
	}
})
