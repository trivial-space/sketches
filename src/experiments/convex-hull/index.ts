import { flow, tools } from './flow'
import { updateFlow } from 'shared-utils/reload'


const graphModules = require.context('./graph', true, /\.ts$/)


flow.setDebug(true)

updateFlow(flow, graphModules)

tools.setFlow(flow, 'convex-hull')

// setTimeout(function () {
// 	flow.setDebug(false)
// }, 1000)

flow.flush()

if (module.hot) {
	module.hot.accept((graphModules as any).id, function() {
		const newGraphModules = require.context('./graph', true, /\.ts$/)
		updateFlow(flow, newGraphModules)
		tools.setFlow(flow, 'convex-hull')
		console.log('flow is newly set!', flow)
		flow.flush()
	})
}

