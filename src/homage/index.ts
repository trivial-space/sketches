import './videos'
import './state/pedestals'
import './state/screens'
import './state/ground'
import './view/effects/ground-reflection'
import './view/geometries/box'
import './view/geometries/plane'
import './view/shaders/object'
import './view/shaders/ground'
import './view/shaders/ground-reflection'
import './view/shaders/screen'
import './view/renderer'
import './view/camera'
import './view/context'
import './events'
import * as flowTree from 'tvs-libs/lib/flow/tree'
import {flow} from './flow'


setTimeout(function() {
  flow.setDebug(false)
}, 100)

window['entities'] = flowTree.create(flow)

if (module.hot) {
  module.hot.accept()
}
