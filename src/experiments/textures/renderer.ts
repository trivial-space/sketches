import { getEffectLayer } from 'shared-utils/painterState'
import { gl, painter } from './context'

// ===== Settings =====

painter.updateDrawSettings({
	clearColor: [0, 0, 0, 1],
	enable: [gl.DEPTH_TEST]
})

// ===== layers =====

export const noise = getEffectLayer(painter, 'noise')

export const toNormal = getEffectLayer(painter, 'toNormal')
