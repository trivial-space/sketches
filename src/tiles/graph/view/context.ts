import {makeContext} from 'tvs-libs/lib/vr/flow-utils'
import * as events from '../events'


export const {context, canvas, canvasSize} = makeContext(events.windowSize)
