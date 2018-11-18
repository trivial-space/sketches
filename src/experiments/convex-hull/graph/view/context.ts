import { setupPainter } from 'tvs-utils/dist/vr/flow-painter-utils'
import { canvas, windowSize } from '../events'

export const { canvasSize, painter, gl } = setupPainter(canvas, windowSize)
