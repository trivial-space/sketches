import * as renderer from 'tvs-renderer/lib/renderer'
import {val, stream} from 'tiles/flow'
import {context} from './context'
import * as plane from './geometries/plane'
import * as tiles from '../state/tiles'
import * as init from '../state/init'
import * as shader from './shaders/base'
import * as events from '../events'
import * as camera from './camera'


const ctx = context

export const settings = val({
  clearColor: [1, 1, 1, 1],
  enable: ['DEPTH_TEST', 'CULL_FACE'],
})


ctx.react(
  'updateSettings',
  [settings.HOT],
  renderer.updateSettings
)


// ===== shaders =====

ctx.react(
  'updateShader',
  [shader.id.HOT, shader.spec.HOT],
  renderer.updateShader
)


// ===== geometries =====

ctx.react(
  'updateGeometry',
  [plane.id.HOT, plane.geometry.HOT],
  renderer.updateGeometry
)


// ===== objects =====


ctx.react(
  'updateObjects',
  [
    tiles.ids.HOT,
    tiles.activeTiles.COLD,
    shader.id.HOT,
    plane.id.HOT,
  ],
  (ctx, ids, tiles, shaderId, geoId) => {

    ids.forEach((id, i) => {
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
)


// ===== layers =====

export const getTileTextureId = name => name + '-texture'

ctx.react(
  'updateTileTextureLayers',
  [init.images.HOT],
  (ctx, imgs) => {
    imgs.forEach(([id, img]) =>
      renderer.updateLayer(ctx, getTileTextureId(id), { asset: img })
    )
    return ctx
  }
)


export const sceneLayerId = val('sceneLayer')


ctx.react(
  'updateSceneLayer',
  [
    sceneLayerId.HOT,
    tiles.ids.HOT,
    camera.view.HOT,
    camera.perspective.HOT
  ],
  (ctx, id, tiles, view, projection) =>
    renderer.updateLayer(ctx, id, {
      objects: tiles,
      uniforms: {
        view,
        projection
      }
    })
)


// ===== render =====

export const layers = stream(
  [sceneLayerId.HOT],
  scene => [scene]
)


export const render = stream(
  [ctx.COLD, layers.COLD, events.tick.HOT],
  renderer.renderLayers
)
