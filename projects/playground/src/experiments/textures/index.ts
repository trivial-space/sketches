import { getEffect } from '../../shared-utils/painterState'
import { painter } from './context'

// ===== layers =====

export const noise = getEffect(painter, 'noise')

export const toNormal = getEffect(painter, 'toNormal')
