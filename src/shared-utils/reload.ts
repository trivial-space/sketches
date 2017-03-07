import * as flowTree from 'tvs-libs/lib/flow/tree'
import { resolveEntityIds, isEntity, getGraphFromAll } from "tvs-flow/lib/utils/entity-reference";


export function modulePathToNamespace(path) {
  return path.split('.')[1].split('/').filter(v => v).join('.')
}


export function updateFlow(flow, graphModules) {
  const entities = graphModules.keys()
    .map(path => {
      const module = graphModules(path)
      return Object.values(resolveEntityIds(module, modulePathToNamespace(path)))
        .filter(isEntity)
    })
    .reduce((arr, es) => arr.concat(es), [])

  flow.addGraph(getGraphFromAll(entities))
  window['entities'] = flowTree.create(flow)
}

