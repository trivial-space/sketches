import { makePainterCanvas } from 'tvs-libs/lib/vr/flow-painter-utils'
import * as events from '../events'

export const {canvas, painter, gl, canvasSize} =
	makePainterCanvas(events.windowSize)
