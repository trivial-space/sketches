import * as flowTree from 'tvs-libs/lib/flow/tree'
import { getGraphFromModules } from 'tvs-flow-tools/dist/lib/utils/webpack'


export function updateFlow (flow, graphModules) {
	flow.addGraph(getGraphFromModules(graphModules))
	window['entities'] = flowTree.create(flow)
}

