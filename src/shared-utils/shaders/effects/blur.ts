import { LayerData } from 'tvs-painter'
import { Layer } from 'tvs-painter/dist/layer'
import { PainterContext } from '../../painterState'
import frag from './blur_with_alpha.glsl'

interface BlurOpts {
	strength: number
	size?: number[] | (() => number[])
	strengthOffset?: number | (() => number)
	blurRatioVertical?: number
	scaleFactor?: number
	layerOpts?: LayerData
	startLayer?: Layer
}

export function getBlurByAlphaEffect(
	Q: PainterContext,
	id: string,
	{
		strength,
		size,
		layerOpts,
		startLayer,
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

	return Q.getEffect(id).update({
		...layerOpts,
		frag,
		drawSettings: {
			disable: [Q.gl.DEPTH_TEST],
		},
		uniforms: passData.map((data) => ({
			...data,
			blurRatioVertical,
			strengthOffset,
			size: size || (() => [Q.gl.canvas.width, Q.gl.canvas.height]),
		})),
	})
}
