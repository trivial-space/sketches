import { val } from 'tvs-flow/lib/utils/entity-reference'
import { makePainterCanvas } from 'tvs-libs/lib/vr/flow-painter-utils'
import * as events from './events'
import { DrawSettings } from 'tvs-renderer/lib'


export const {canvas, painter, gl, canvasSize} =
	makePainterCanvas(events.windowSize)


export const settings = val<DrawSettings>({
	clearColor: [0, 0, 0, 1]
}).reset()


painter.react(
	[settings.HOT],
	(p, settings) => p.updateDrawSettings(settings)
)
