import 'systemjs-hot-reloader/default-listener.js'
import 'tvs-flow-editor/dist/css/style.css!'

import * as flow from 'tvs-flow'
import flowEditor from 'tvs-flow-editor'
import renderer from 'tvs-renderer'
import libs from 'tvs-libs'
import glMatrix from 'gl-matrix'
import box from 'geo-3d-box'
import {graph} from './graph.js'


const localStorageKey = "__homage"
const localGraph = localStorage.getItem(localStorageKey)

const runtime = flow.create()

const context = {
  renderer: renderer,
  mat4: glMatrix.mat4,
  geometry: {
    plane: libs.geometry.plane,
    box: box
  }
}

console.log('fufufu')

runtime.setContext(context)

window.runtime = runtime
window.context = context

runtime.setDebug(true)
try {
  if (localGraph) {
    runtime.addGraph(JSON.parse(localGraph))
  } else {
    runtime.addGraph(graph)
  }
} catch (e) {
  console.warn(e)
}

flowEditor.init(runtime, localStorageKey)
runtime.setDebug(false)
