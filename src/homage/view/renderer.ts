import {entity, addToFlow, SELF} from '../flow'
import {renderer} from 'tvs-renderer'
import ctx from './context'

import * as boxGeo from './geometries/box'
import * as planeGeo from './geometries/plane'


export const settings = entity({
  clearColor: [0, 0, 0, 1],
  minFilter: 'LINEAR',
  magFilter: 'LINEAR'
})


ctx.stream({
  id: 'updateSettings'
    with: {
      ctx: SELF,
      settings: settings.HOT
    },
    do: ({ctx, settings}) => renderer.updateSettings(ctx, settings)
  })


// ===== Geometries =====

ctx.stream({
  id: 'updateBoxGeometry',
  with: {
    ctx: SELF,
    geo: boxGeo.geometry.HOT,
    id: boxGeo.id.HOT
  },
  do: ({geo, id, ctx}) => renderer.updateGeometry(ctx, id, geo)
})


ctx.stream({
  id: 'updatePlaneGeometry',
  with: {
    ctx: SELF,
    geo: planeGeo.geometry.HOT,
    id: planeGeo.id.HOT
  },
  do: ({geo, id, ctx}) => renderer.updateGeometry(ctx, id, geo)
})


// ===== Shaders =====


// ===== Layers =====
export const layers = entity()
  .stream({
    with: {
      scene: 'H layers.scene.id',
      reflections: 'H layers.groundReflection.ids',
      mirrorScene: 'H layers.mirrorScene.id'
    },
    do: ({scene, reflections, mirrorScene}) =>
      [mirrorScene].concat(reflections).concat([scene])
  })


export const render = entity()
  .stream({
    with: {
      tick: 'H events.tick',
      layers: 'H #layers',
      ctx: 'C #context'
    },
    do: ({ctx, layers}) => renderer.renderLayers(ctx, layers)
  })


export const updateSize = entity()
  .stream({
    with: {
      ctx: 'C #context',
      size: 'H #canvasSize'
    },
    do: ({ctx}) => renderer.updateSize(ctx)
  })


addToFlow({

}, 'renderer')
