import * as tvsTools from 'tvs-flow-tools'
import * as runtime from 'tvs-flow/dist/lib/runtime'

export const flow = runtime.create()

export const tools = tvsTools.ui.start('graph-sort')

; (window as any)['flow'] = flow
; (window as any)['tools'] = tools
