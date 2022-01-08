import { events, Q } from './context'
import { makeBrushStroke } from './brushStrokes'
import { getNoiseTextureData } from '../../../../shared-utils/texture-helpers'
import {
	createLine,
	Line,
	lineToFormCollection,
} from '../../../../shared-utils/geometry/lines_2d'
import {
	brushStrokeFrag,
	brushStrokeVert,
} from '../../../../shared-utils/shaders/brushStrokeLineShader'
import { subdivideTiles, Tile } from './tiles'
import { doTimes } from 'tvs-libs/dist/utils/sequence'

const lineWidth = 20

const shade = Q.getShade('line').update({
	frag: brushStrokeFrag,
	vert: brushStrokeVert,
})

export const noiseTex = Q.getLayer('noiseTex').update({
	texture: getNoiseTextureData({
		width: 256,
		height: 256,
		startX: 3,
		startY: 3,
		data: {
			magFilter: 'LINEAR',
			minFilter: 'LINEAR',
			wrap: 'REPEAT',
		},
	}),
})

// === scene ===

Q.painter.updateDrawSettings({
	clearBits: 0,
	enable: [Q.gl.BLEND],
})

export const scene = Q.getLayer('scene').update({
	drawSettings: {
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.ONE,
			Q.gl.ONE,
		],
	},
})

Q.listen('index', events.RESIZE, () => {
	scene.update({
		uniforms: {
			noiseTex: noiseTex.image(),
			size: [Q.gl.drawingBufferWidth, Q.gl.drawingBufferHeight],
			texScale: [20, 1],
			edgeSharpness: 3,
		},
		sketches: [
			Q.getEffect('').update({
				frag: 'precision mediump float; void main(void) {gl_FragColor = vec4(1.0);}',
			}),
		],
	})

	Q.painter.compose(scene)

	animate()
})

let tiles: Tile[] = [
	{
		color: [1, 1, 1],
		top: 0,
		left: 0,
		width: Q.gl.drawingBufferWidth,
		height: Q.gl.drawingBufferHeight,
	},
]

doTimes(() => {
	tiles = subdivideTiles(tiles, lineWidth)
}, 7)

const animations = tiles.map((t) => {
	return createLineAnimation(
		makeBrushStroke(t.top, t.left, t.width, t.height, lineWidth),
		t.color,
	)
})

function animate() {
	for (const run of animations) {
		run()
	}
}

function createLineAnimation(line: Line, color: [number, number, number]) {
	const data = lineToFormCollection(line, {
		lineWidth,
		storeType: 'DYNAMIC',
		smouthCount: 3,
	})

	function render() {
		const sketches = data
			.map((d, i) => Q.getForm('form' + i).update(d))
			.map((form, i) =>
				Q.getSketch('line' + i).update({
					form,
					shade,
					uniforms: { color },
				}),
			)

		scene.update({ sketches })
		Q.painter.compose(scene).show(scene)
	}

	return render
}
