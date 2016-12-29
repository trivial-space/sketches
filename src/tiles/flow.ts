import * as runtime from 'tvs-flow/lib/runtime'
import * as references from 'tvs-flow/lib/utils/entity-reference'

export const flow = runtime.create()
export const {val, json, stream, asyncStream, streamStart, asyncStreamStart, addToFlow} = references.create(flow)

flow.setDebug(true)

window['flow'] = flow
