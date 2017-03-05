import * as flow from 'homage/flow'
import {makeContext} from 'tvs-libs/lib/vr/flow-utils'
import * as events from '../events'


export const {context, canvas, canvasSize} = makeContext(flow, events.windowSize)
