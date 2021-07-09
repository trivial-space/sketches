import { Sketch } from 'tvs-painter/dist/sketch'
import { baseEvents, PainterContext } from '../../shared-utils/painterState'
import { mat4 } from 'gl-matrix'
import { PerspectiveViewportState } from '../../shared-utils/vr/perspectiveViewport'
import { getBlurByAlphaEffect } from '../../shared-utils/shaders/effects/blur'
import { makeXZPlane } from '../../shared-utils/geometry/helpers'
import { groundVert, makeGroundFrag } from './mirror-scene-shaders'
import { TaggedFn2, TaggedFn3 } from '@thi.ng/shader-ast'

const sceneId = 'mirror-scene-ground'

interface MirrorSceneOptions {
	reflectionStrength?: number
	renderWithDistanceAlphaUniformName?: string
	scale?: number
	width?: number
	height?: number
	groundShaderColorFn?: TaggedFn3<'vec4', 'float', 'vec2', 'vec4'>
	blurStrengh?: number
	blurRatioVertical?: number
	blurStrenghOffset?: number
}

export function createMirrorScene(
	Q: PainterContext<PerspectiveViewportState>,
	objectSketches: Sketch[],
	options: MirrorSceneOptions = {},
) {
	const {
		width,
		height,
		scale = 1,
		renderWithDistanceAlphaUniformName = 'withDistance',
		groundShaderColorFn,
		blurStrengh = 20,
		blurRatioVertical = 2,
		blurStrenghOffset = 0.3,
		reflectionStrength = 1,
	} = options
	const groundForm = Q.getForm(sceneId).update(makeXZPlane(100, 3))

	const floorTransform = mat4.create()
	mat4.scale(floorTransform, floorTransform, [scale, scale, scale])

	const floorMirrorView = mat4.create()

	// prettier-ignore
	const mirrorMatrix = mat4.fromValues(
		1, 0, 0, 0,
		0, -1, 0, 0,
		0, 0, 1, 0,
		0, 0, 0, 1,
	)

	const groundShade = Q.getShade(sceneId).update({
		vert: groundVert,
		frag: makeGroundFrag(groundShaderColorFn),
	})

	const groundSketch = Q.getSketch(sceneId).update({
		form: groundForm,
		shade: groundShade,
		uniforms: {
			transform: floorTransform,
			reflection: '0',
			size: () => [
				width || Q.painter.canvas.width,
				height || Q.painter.canvas.height,
			],
			reflectionStrength,
		},
	})

	// ===== layers =====

	const mirrorScene = Q.getLayer(sceneId).update({
		sketches: objectSketches,
		uniforms: {
			view: () =>
				mat4.multiply(
					floorMirrorView,
					Q.state.viewPort.camera.viewMat,
					mirrorMatrix,
				),
			projection: () => Q.state.viewPort.camera.projectionMat,
			[renderWithDistanceAlphaUniformName]: 1,
		},
		drawSettings: {
			clearBits: Q.gl.DEPTH_BUFFER_BIT | Q.gl.COLOR_BUFFER_BIT,
		},
	})

	const scene = Q.getLayer('scene').update({
		sketches: [groundSketch].concat(objectSketches),
		uniforms: {
			view: () => Q.state.viewPort.camera.viewMat,
			projection: () => Q.state.viewPort.camera.projectionMat,
			[renderWithDistanceAlphaUniformName]: 0,
		},
		drawSettings: {
			clearBits: Q.gl.DEPTH_BUFFER_BIT | Q.gl.COLOR_BUFFER_BIT,
		},
	})

	const blurEffect = getBlurByAlphaEffect(Q, 'blur', {
		strength: blurStrengh,
		strengthOffset: blurStrenghOffset,
		blurRatioVertical,
	})

	const main = Q.getFrame('main').update({
		layers: [mirrorScene, blurEffect, scene],
		width,
		height,
	})

	if (!(width || height)) {
		Q.listen(sceneId, baseEvents.RESIZE, () => {
			main.update()
		})
	}

	return main
}
