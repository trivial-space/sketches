import * as flowTree from 'tvs-libs/lib/flow/tree'
import {flow, addToFlow} from './flow'

const requireGraph = require.context('./graph', true, /\.ts$/)


function modulePathToNamespace(path) {
  return path.split('.')[1].split('/').filter(v => v).join('.')
}

function updateFlow(graph) {
  graph.keys().forEach(path => {
    const module = graph(path)
    addToFlow(module, modulePathToNamespace(path))
  })
  window['entities'] = flowTree.create(flow)
}


flow.setDebug(true)
updateFlow(requireGraph)
setTimeout(function () {
  flow.setDebug(false)
}, 1000)
  
  
if (module.hot) {
  module.hot.accept((requireGraph as any).id, function() {
    const newGraph = require.context('./graph', true, /\.ts$/)
    updateFlow(newGraph)
  })
}
