import * as entity from '../flow'
import {makeContext} from 'tvs-libs/lib/vr/flow-utils'
import * as events from '../events'


const context = makeContext(entity, events.windowSize)

export default context

entity.addToFlow(context, 'view.context')
