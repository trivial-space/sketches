import * as flowTree from 'tvs-flow-tools/dist/lib/console/tree'
import { getGraphFromModules } from 'tvs-flow-tools/dist/lib/utils/webpack'


export function updateFlow (flow, graphModules) {
	flow.replaceGraph(getGraphFromModules(graphModules))
	window['entities'] = flowTree.create(flow)
}

