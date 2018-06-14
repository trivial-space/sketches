import vert from './glsl/base.vert'
import frag from './glsl/base.frag'
import { getShade } from 'shared-utils/painterState'
import { painter } from 'colorwalls/context'


export const baseShade = getShade(painter, 'baseShade')
	.update({
		vert, frag
	})


export const groundShade = getShade(painter, 'groundShade')
	.update({
		vert, frag
	})


if (module.hot) {
	module.hot.accept()
}
