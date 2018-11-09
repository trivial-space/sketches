import { getEffectLayer } from 'shared-utils/painterState'
import { Layer, LayerData, Painter } from 'tvs-painter'
import frag from './blur_with_alpha.glsl'

interface BlurOpts {
	strength: number
	size?: number[] | (() => number[])
	strengthOffset?: number | (() => number)
	blurRatioVertical?: number
	scaleFactor?: number,
	layerOpts?: LayerData,
	startLayer?: Layer
}

export function getBlurByAlphaEffect (painter: Painter, id: string, {
	strength,
	size,
	layerOpts,
	startLayer,
	strengthOffset = 0,
	blurRatioVertical = 1,
	scaleFactor = 0.6
}: BlurOpts) {
	const passData: any[] = []

	while (strength >= 1) {
		passData.push({
			strength,
			direction: 0,
			source: null
		})
		passData.push({
			strength: strength * blurRatioVertical,
			direction: 1,
			source: null
		})
		strength *= scaleFactor
	}

	if (startLayer) {
		passData[0].source = startLayer.texture()
	}

	const opts = size && typeof size !== 'function'
		? { width: size[0], height: size[1] }
		: {}

	return getEffectLayer(painter, id)
		.update({
			...opts,
			...layerOpts,
			frag,
			flipY: true,
			drawSettings: {
				disable: [painter.gl.DEPTH_TEST]
			},
			uniforms: passData.map(data => ({
				...data,
				blurRatioVertical,
				strengthOffset,
				size: size || (() => [painter.gl.canvas.width, painter.gl.canvas.height])
			}))
		})
}
