import * as runtime from 'tvs-flow/lib/runtime'
export * from 'tvs-flow/lib/utils/entity-reference'

export const flow = runtime.create()

window['flow'] = flow
