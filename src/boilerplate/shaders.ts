import vert from './glsl/base.vert'
import frag from './glsl/base.frag'
import { getShade } from 'shared-utils/painterState'
import { painter } from './context'


export const baseShade = getShade(painter, 'base')
	.update({ vert, frag })
