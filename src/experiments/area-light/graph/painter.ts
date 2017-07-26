import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { makePainterCanvas } from 'tvs-libs/dist/lib/vr/flow-painter-utils'
import * as events from './events'
import { DrawSettings } from 'tvs-painter/dist/lib'


export const settings = val<DrawSettings>({
	clearColor: [0, 0, 0, 1]
}).reset()


export const {canvas, painter, gl, canvasSize} =
	makePainterCanvas(events.windowSize, settings)
