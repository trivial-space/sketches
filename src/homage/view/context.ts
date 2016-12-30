import * as flow from '../flow'
import {makeContext} from 'tvs-libs/lib/vr/flow-utils'
import * as events from '../events'


const context = makeContext(flow, events.windowSize)

export default context

flow.addToFlow(context, 'view.context')
