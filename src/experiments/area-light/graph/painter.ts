import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { setupPainter } from 'tvs-utils/dist/lib/vr/flow-painter-utils'
import { DrawSettings } from 'tvs-painter/dist/lib'
import { canvas, windowSize } from './events'


export const settings = val<DrawSettings>({
	clearColor: [0, 0, 0, 1]
}).reset()


export const {painter, gl, canvasSize} =
	setupPainter(canvas, windowSize, settings)
