import { Sketch } from 'tvs-painter/dist/sketch'
import { Painter } from 'tvs-painter'
import { isPrimitive } from 'util'
import {
	getShade,
	getSketch,
	addSystem,
	getFrame,
	baseEvents,
	getLayer,
	getForm,
} from '../../shared-utils/painterState'
import { mat4 } from 'gl-matrix'
import { PerspectiveViewportState } from '../../shared-utils/vr/perspectiveViewport'
import { getBlurByAlphaEffect } from '../../shared-utils/shaders/effects/blur'
import { makeXZPlane } from '../../shared-utils/geometry-helpers'
import { groundVert, groundFrag } from './mirror-scene-shaders'

const sceneId = 'mirror-scene-ground'

interface MirrorSceneOptions {
	scale?: number
	width?: number
	height?: number
}

export function createMirrorScene(
	painter: Painter,
	state: PerspectiveViewportState,
	objectSketches: Sketch[],
	options: MirrorSceneOptions = {},
) {
	const { width, height, scale = 1 } = options
	const groundForm = getForm(painter, sceneId).update(makeXZPlane(100, 10))

	const floorTransform = mat4.create()
	mat4.scale(floorTransform, floorTransform, [scale, scale, scale])

	const floorMirrorView = mat4.create()
	const mirrorMatrix = mat4.fromValues(
		1,
		0,
		0,
		0,
		0,
		-1,
		0,
		0,
		0,
		0,
		1,
		0,
		0,
		0,
		0,
		1,
	)

	const groundShade = getShade(painter, sceneId).update({
		vert: groundVert,
		frag: groundFrag,
	})

	const groundSketch = getSketch(painter, sceneId).update({
		form: groundForm,
		shade: groundShade,
		uniforms: {
			transform: floorTransform,
			reflection: '0',
			size: () => [
				width || painter.canvas.width,
				height || painter.canvas.height,
			],
		},
	})

	// ===== layers =====

	const mirrorScene = getLayer(painter, sceneId).update({
		sketches: objectSketches,
		uniforms: {
			view: () =>
				mat4.multiply(
					floorMirrorView,
					state.viewPort.camera.viewMat,
					mirrorMatrix,
				),
			projection: () => state.viewPort.camera.projectionMat,
		},
		drawSettings: {
			clearBits: painter.gl.DEPTH_BUFFER_BIT | painter.gl.COLOR_BUFFER_BIT,
		},
	})

	const scene = getLayer(painter, 'scene').update({
		sketches: [groundSketch].concat(objectSketches),
		uniforms: {
			view: () => state.viewPort.camera.viewMat,
			projection: () => state.viewPort.camera.projectionMat,
		},
		drawSettings: {
			clearBits: painter.gl.DEPTH_BUFFER_BIT | painter.gl.COLOR_BUFFER_BIT,
		},
	})

	const blurEffect = getBlurByAlphaEffect(painter, 'blur', {
		strength: 10,
		strengthOffset: 0.3,
		blurRatioVertical: 3,
	})

	const main = getFrame(painter, 'main').update({
		layers: [mirrorScene, blurEffect, scene],
		width,
		height,
	})

	if (!(width || height)) {
		addSystem(sceneId, (e, s) => {
			if (e === baseEvents.RESIZE) {
				main.update()
			}
		})
	}

	return main
}
