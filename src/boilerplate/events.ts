import { keyboard } from 'tvs-libs/dist/lib/events/keyboard'
import { mouse } from 'tvs-libs/dist/lib/events/mouse'
import { windowSize } from 'tvs-libs/dist/lib/events/dom'
import { painter, canvas, state } from './context'
import { once } from 'shared-utils/scheduler'


windowSize(() => once(() => {
	painter.resize()
	state.viewPort.updateSize(canvas)
}, 'resize'))


state.input = {} as any

mouse(
	{element: canvas, enableRightButton: true},
	m => state.input.mouse = m
)

keyboard(k => state.input.keys = k)
