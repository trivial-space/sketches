import { flow, tools, flowTitle } from 'flow/boilerplate/flow'
import { updateFlow } from 'shared-utils/reload'

const graphModules = require.context('./graph', true, /\.ts$/)

flow.setDebug(true)

updateFlow(flow, graphModules)

tools.setFlow(flow, flowTitle)

setTimeout(function() {
	flow.setDebug(false)
}, 1000)

flow.flush()

if (module.hot) {
	module.hot.accept((graphModules as any).id, function() {
		const newGraphModules = require.context('./graph', true, /\.ts$/)
		updateFlow(flow, newGraphModules)
		tools.setFlow(flow, flowTitle)
	})
}
