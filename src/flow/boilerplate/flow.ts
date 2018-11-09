import * as runtime from 'tvs-flow/dist/lib/runtime'
import * as tvsTools from 'tvs-flow-tools'

export const flowTitle = '__boilerplate__'

export const flow = runtime.create()

export const tools = tvsTools.ui.start(flowTitle)

window['flow'] = flow
window['tools'] = tools
