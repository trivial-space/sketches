import vert from './glsl/base.vert'
import frag from './glsl/base.frag'
import { getShade } from 'shared-utils/painterState'
import { painter } from './context'


export const baseShade = getShade(painter, 'baseShade')
	.update({ vert, frag })


if (module.hot) {
	module.hot.accept()
}
