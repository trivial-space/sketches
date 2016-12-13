import 'systemjs-hot-reloader/default-listener.js'

import './view/context'
import './view/shaders/base'
import './view/geometries/plane'
import './view/renderer'
import './view/camera'
import './events'
import './state/constants'
import './state/init'
import './state/tiles'

import * as flowTree from 'tvs-libs/lib/flow/tree'
import { flow } from './flow'

setTimeout(function() {
  flow.setDebug(false)
}, 300)


window['entities'] = flowTree.create(flow)

setTimeout(function(){
  //entities.events.tick.streams.tickStream.stop()
}, 1000)
