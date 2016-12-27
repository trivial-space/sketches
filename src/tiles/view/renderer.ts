import * as renderer from 'tvs-renderer/lib/renderer'
import {entity, SELF, addToFlow} from '../flow'
import context from './context'
import * as plane from './geometries/plane'
import * as tiles from '../state/tiles'
import * as init from '../state/init'
import * as shader from './shaders/base'
import * as events from '../events'
import * as camera from './camera'


const ctx = context.context

export const settings = entity({
  clearColor: [1, 1, 1, 1],
  enable: ['DEPTH_TEST', 'CULL_FACE'],
})


ctx.stream({
  id: 'updateSettings',
  with: [
    SELF,
    settings.HOT
  ],
  do: ([ctx, settings]) => {
    console.log("==================", ctx, settings)
    return renderer.updateSettings(ctx, settings)
  }
})


// ===== shaders =====

ctx.stream({
  id: 'updateShader',
  with: {
    ctx: SELF,
    id: shader.id.HOT,
    spec: shader.spec.HOT
  },
  do: ({id, ctx, spec}) => renderer.updateShader(ctx, id, spec)
})


// ===== geometries =====

ctx.stream({
  id: 'updateGeometry',
  with: {
    ctx: SELF,
    geo: plane.geometry.HOT,
    id: plane.id.HOT
  },
  do: ({geo, id, ctx}) => renderer.updateGeometry(ctx, id, geo)
})


// ===== objects =====


ctx.stream({
  id: 'updateObjects',
  with: {
    ctx: SELF,
    ids: tiles.ids.HOT,
    shaderId: shader.id.HOT,
    geoId: plane.id.HOT,
    tiles: tiles.activeTiles.COLD
  },
  do: ({ctx, ids, shaderId, geoId, tiles}) => {

    tiles && ids.forEach((id, i) => {
      const tile: tiles.TileState = tiles[i]
      renderer.updateObject(ctx, id, {
        shader: shaderId,
        geometry: geoId,
        blend: true,
        uniforms: {
          transform: tile.transform,
          image: getTileTextureId(tile.tileSpecId),
          color: tile.color,
          connections: tile.connections
        }
      })
    })

    return ctx
  }
})


// ===== layers =====

export const getTileTextureId = name => name + '-texture'

ctx.stream({
  id: 'updateTileTextureLayers',
  with: {
    imgs: init.images.HOT,
    ctx: SELF
  },
  do: ({ctx, imgs}) => {
    imgs && imgs.forEach(([id, img]) => {
      renderer.updateLayer(ctx, getTileTextureId(id), { asset: img })
    })
    return ctx
  }
})


export const sceneLayerId = entity('sceneLayer')


ctx.stream({
  id: 'updateSceneLayer',
  with: {
    ctx: SELF,
    id: sceneLayerId.HOT,
    tiles: tiles.ids.HOT,
    view: camera.view.HOT,
    projection: camera.perspective.HOT
  },
  do: ({ctx, tiles, id, view, projection}) => {

    return renderer.updateLayer(ctx, id, {
      objects: tiles,
      uniforms: {
        view,
        projection
      }
    })
  }
})


// ===== render =====

export const layers = entity()
  .stream({
    with: {
      scene: sceneLayerId.HOT
    },
    do: ({scene}) => [scene]
  })


export const render = entity()
  .stream({
    with: {
      tick: events.tick.HOT,
      layers: layers.COLD,
      ctx: ctx.COLD,
    },
    do: ({ctx, layers}) => {
      renderer.renderLayers(ctx, layers)
    }
  })


  addToFlow({
    settings,
    sceneLayerId,
    layers,
    render
  }, 'view.renderer')
