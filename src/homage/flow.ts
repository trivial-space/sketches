import * as runtime from 'tvs-flow/lib/runtime'
import {create} from 'tvs-flow/lib/utils/entity-reference'

export const flow = runtime.create()
export const {val, json, stream, streamStart, asyncStream, asyncStreamStart, addToFlow} = create(flow)

window['flow'] = flow
