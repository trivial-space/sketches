import '../../../../shared-utils/css/fullscreen.css'
import { events, Q } from './context'
import { makeBrushStroke } from '../../../../shared-utils/sketches/brushStrokes/brushStrokes'
import { lineToFormCollection } from '../../../../shared-utils/geometry/lines_2d'
import {
	brushStrokeFrag,
	brushStrokeVert,
} from '../../../../shared-utils/sketches/brushStrokes/brushStrokeLineShader'
import { subdivideTiles, Tile } from './tiles'
import { doTimes } from 'tvs-libs/dist/utils/sequence'
import { getNoiseTextureData } from '../../../../shared-utils/graphics/texture-helpers'

Q.state.device.sizeMultiplier = window.devicePixelRatio
const lineWidth = (Q.state.device.canvas.height * window.devicePixelRatio) / 32

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

let tiles: Tile[] = [
	{
		color: [1, 1, 1],
		top: 0,
		left: 0,
		width: Q.gl.drawingBufferWidth * window.devicePixelRatio,
		height: Q.gl.drawingBufferHeight * window.devicePixelRatio,
	},
]

doTimes(() => {
	tiles = subdivideTiles(tiles, lineWidth)
}, 7)

export const scene = Q.getLayer('scene').update({
	drawSettings: {
		clearBits: 0, // no clearing
		enable: [Q.gl.BLEND],
		blendFuncSeparate: [
			Q.gl.SRC_ALPHA,
			Q.gl.ONE_MINUS_SRC_ALPHA,
			Q.gl.DST_ALPHA,
			Q.gl.SRC_ALPHA,
		],
	},
})

const lineSketches = tiles.map((t, i) => {
	const line = makeBrushStroke({
		left: t.left - lineWidth / 3,
		top: t.top + lineWidth / 1.5,
		width: t.width + lineWidth / 3,
		height: t.height - lineWidth * 1.5,
		offsetX: lineWidth * 0.7,
		offsetY: lineWidth * 0.4,
		steps: Math.floor(t.height / (lineWidth * 1.2)),
		curveHeight: lineWidth,
		heightFactorFunction: (n) => n * 1.5 - 0.6,
	})

	const data = lineToFormCollection(line, {
		lineWidth,
		storeType: 'DYNAMIC',
		smouthCount: 3,
	})

	return data
		.map((d, j) => Q.getForm('form' + i + '_' + j).update(d))
		.map((form, j) =>
			Q.getSketch('line' + i + '_' + j).update({
				form,
				shade,
				uniforms: { color: t.color },
			}),
		)
})

const postProcessShader = `precision mediump float;
uniform sampler2D source;
varying vec2 coords;
void main() {
	vec4 color = texture2D(source, coords);
	gl_FragColor = vec4(mix(color.xyz, vec3(1.0), color.w), 1.0);
}
`

const effect = Q.getEffect('postProcess').update({
	frag: postProcessShader,
	uniforms: {
		source: () => scene.image(),
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

	for (const sketches of lineSketches) {
		scene.update({ sketches })
		Q.painter.compose(scene)
	}

	Q.painter.draw({ effects: effect })
})
