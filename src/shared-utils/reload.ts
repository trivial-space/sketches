import * as flowTree from 'tvs-flow-tools/dist/lib/console/tree'
import { getGraphFromModules } from 'tvs-flow-tools/dist/lib/utils/webpack'
import { Runtime } from 'tvs-flow/dist/lib/runtime-types'

export function updateFlow(flow: Runtime, graphModules: any) {
	flow.replaceGraph(getGraphFromModules(graphModules))
	;(window as any)['entities'] = flowTree.create(flow)
}
