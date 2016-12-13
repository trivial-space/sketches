import {entity, addToFlow} from '../flow'
import {makeContext} from 'tvs-libs/lib/vr/flow-utils'
import * as events from '../events'


const context = makeContext(entity, events.windowSize)

export default context

addToFlow(context, 'view.context')
