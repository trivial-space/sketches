import * as runtime from 'tvs-flow/lib/runtime'
// import * as tvsTools from 'tvs-flow-tools'
import graph from './nodes.json'

export const flow = runtime.create()

// export const tools = tvsTools.ui.start('hommage', { graph })

; (window as any)['flow'] = flow
// ; (window as any)['tools'] = tools
