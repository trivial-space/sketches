import { TaggedFn3 } from '@thi.ng/shader-ast'
import { mat4 } from 'gl-matrix'
import { Sketch } from 'tvs-painter/dist/sketch'
import { PainterContext, baseEvents } from '../app/painterState'
import { makeXZPlane } from '../geometry/helpers'
import { getBlurByAlphaEffect } from '../shaders/effects/blur'
import { groundVert, makeGroundFrag } from './mirror-scene-shaders'
import { PerspectiveViewportState } from './perspectiveViewport'

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

	const blurEffect = getBlurByAlphaEffect(Q, 'blur', {
		strength: blurStrengh,
		strengthOffset: blurStrenghOffset,
		blurRatioVertical,
	})

	const mirrorScene = Q.getLayer(sceneId).update({
		sketches: objectSketches,
		effects: blurEffect,
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
		width,
		height,
	})

	const groundSketch = Q.getSketch(sceneId).update({
		form: groundForm,
		shade: groundShade,
		uniforms: {
			transform: floorTransform,
			reflection: () => mirrorScene.image(),
			size: () => [
				width || Q.gl.drawingBufferWidth,
				height || Q.gl.drawingBufferHeight,
			],
			reflectionStrength,
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
		width,
		height,
	})

	if (!(width || height)) {
		Q.listen(sceneId, baseEvents.RESIZE, () => {
			scene.update()
			mirrorScene.update()
		})
	}

	return { scene, mirrorScene }
}
