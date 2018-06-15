import frag from './glsl/ground-reflection-frag.glsl'
import { getEffectLayer } from 'shared-utils/painterState'
import { painter, gl } from './context'
import { canvasSize } from './events'


let strength = 10


export const passData: any[] = []

while (strength >= 1) {
	passData.push({
		direction: 0,
		strength: strength * 1.5
	})
	passData.push({
		direction: 1,
		strength: strength * 6
	})
	strength /= 2
}


export const effectLayer = getEffectLayer(painter, 'reflection')
	.update({
		frag,
		flipY: true,
		drawSettings: {
			disable: [gl.DEPTH_TEST]
		},
		uniforms: passData.map(data => ({
			...data,
			source: null,
			size: canvasSize
		}))
	})


if (module.hot) {
	module.hot.accept()
}
