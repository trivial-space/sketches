import { getEffect } from 'shared-utils/painterState'
import { LayerData, Painter } from 'tvs-painter'
import { Frame } from 'tvs-painter/dist/frame'
import frag from './blur_with_alpha.glsl'

interface BlurOpts {
	strength: number
	size?: number[] | (() => number[])
	strengthOffset?: number | (() => number)
	blurRatioVertical?: number
	scaleFactor?: number
	layerOpts?: LayerData
	startFrame?: Frame
}

export function getBlurByAlphaEffect(
	painter: Painter,
	id: string,
	{
		strength,
		size,
		layerOpts,
		startFrame: startLayer,
		strengthOffset = 0,
		blurRatioVertical = 1,
		scaleFactor = 0.6,
	}: BlurOpts,
) {
	const passData: any[] = []

	while (strength >= 1 / blurRatioVertical) {
		passData.push({
			strength,
			direction: 0,
			source: '0',
		})
		passData.push({
			strength: strength * blurRatioVertical,
			direction: 1,
			source: '0',
		})
		strength *= scaleFactor
	}

	if (startLayer) {
		passData[0].source = () => startLayer.image()
	}

	return getEffect(painter, id).update({
		...layerOpts,
		frag,
		drawSettings: {
			disable: [painter.gl.DEPTH_TEST],
		},
		uniforms: passData.map(data => ({
			...data,
			blurRatioVertical,
			strengthOffset,
			size: size || (() => [painter.gl.canvas.width, painter.gl.canvas.height]),
		})),
	})
}
