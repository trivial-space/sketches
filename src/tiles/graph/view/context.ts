import { makePainterCanvas } from 'tvs-libs/dist/lib/vr/flow-painter-utils'
import * as events from '../events'


export const { canvas, canvasSize, painter, gl } = makePainterCanvas(events.windowSize)
