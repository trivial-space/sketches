import * as runtime from 'tvs-flow/lib/runtime'
import * as tvsTools from 'tvs-flow-tools'
export * from 'tvs-flow/lib/utils/entity-reference'
import graph from './nodes.json'

export const flow = runtime.create()

export const tools = tvsTools.ui.start('hommage', {graph})

window['flow'] = flow
window['tools'] = tools
