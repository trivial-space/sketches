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
import { groundVert, makeGroundFrag } from './mirror-scene-shaders'
import { TaggedFn2, TaggedFn3 } from '@thi.ng/shader-ast'

const sceneId = 'mirror-scene-ground'

interface MirrorSceneOptions {
	renderWithDistanceAlphaUniformName?: string
	scale?: number
	width?: number
	height?: number
	groundShaderColorFn?: TaggedFn3<'vec4', 'float', 'vec2', 'vec4'>
}

export function createMirrorScene(
	painter: Painter,
	state: PerspectiveViewportState,
	objectSketches: Sketch[],
	options: MirrorSceneOptions = {},
) {
	const {
		width,
		height,
		scale = 1,
		renderWithDistanceAlphaUniformName = 'withDistance',
		groundShaderColorFn,
	} = options
	const groundForm = getForm(painter, sceneId).update(makeXZPlane(100, 3))

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
		frag: makeGroundFrag(groundShaderColorFn),
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
			[renderWithDistanceAlphaUniformName]: 1,
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
			[renderWithDistanceAlphaUniformName]: 0,
		},
		drawSettings: {
			clearBits: painter.gl.DEPTH_BUFFER_BIT | painter.gl.COLOR_BUFFER_BIT,
		},
	})

	const blurEffect = getBlurByAlphaEffect(painter, 'blur', {
		strength: 20,
		strengthOffset: 0.3,
		blurRatioVertical: 2,
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
