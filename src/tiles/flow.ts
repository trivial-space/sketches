import * as runtime from 'tvs-flow/lib/runtime'
import * as references from 'tvs-flow/lib/utils/entity-reference'

export const flow = runtime.create()
export const {entity, addToFlow, SELF} = references.create(flow)

flow.setDebug(true)

window['flow'] = flow
