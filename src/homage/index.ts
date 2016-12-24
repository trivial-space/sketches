import './videos'
import './renderer'
import './geometries/box'
import './geometries/plane'
import './shaders/object'
import './shaders/ground'
import './shaders/ground-reflection'
import './shaders/screen'
import './objects/pedestals'
import './objects/screens'
import './objects/ground'
import './layers/videos'
import './layers/scene'
import './layers/mirrorScene'
import './layers/ground-reflection'
import './camera'
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
