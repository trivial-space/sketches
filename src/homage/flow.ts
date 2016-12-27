import {runtime} from 'tvs-flow/lib/runtime'
import {create} from 'tvs-flow/lib/utils/entity-reference'

export const flow = runtime.create()
export const {entity, addToFlow, SELF} = create(flow)

flow.setDebug(true)

window['flow'] = flow
