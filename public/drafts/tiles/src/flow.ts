import * as runtime from 'tvs-flow'
import {create} from 'tvs-flow/lib/utils/entity-reference'

export const flow = runtime.create()
export const {entity, addToFlow, SELF} = create(flow)

flow.setDebug(true)

window['flow'] = flow
