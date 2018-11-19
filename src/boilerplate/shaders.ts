import { getShade } from 'shared-utils/painterState'
import { painter } from './context'
import frag from './glsl/base.frag'
import vert from './glsl/base.vert'

export const baseShade = getShade(painter, 'base').update({ vert, frag })
