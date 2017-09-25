import { setupPainter } from 'tvs-libs/dist/lib/vr/flow-painter-utils'
import { canvas, windowSize } from '../events'


export const { canvasSize, painter, gl } = setupPainter(canvas, windowSize)
