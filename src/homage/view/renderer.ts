import {val, stream, addToFlow} from '../flow'
import {renderer} from 'tvs-renderer'
import context from './context'
import {tick} from '../events'

import * as boxGeo from './geometries/box'
import * as planeGeo from './geometries/plane'
import * as videos from '../videos'
import * as camera from './camera'

const ctx = context.context


export const settings = val({
  clearColor: [0, 0, 0, 1],
  minFilter: 'LINEAR',
  magFilter: 'LINEAR'
})


ctx.react(
  'updateSettings',
  [settings.HOT],
  renderer.updateSettings
)


// ===== Geometries =====

ctx.react(
  'updateBoxGeometry',
  [boxGeo.id.HOT, boxGeo.geometry.HOT],
  renderer.updateGeometry
)


ctx.react(
  'updatePlaneGeometry',
  [planeGeo.id.HOT, planeGeo.geometry.HOT],
  renderer.updateGeometry
)


// ===== Shaders =====


// ===== Layers =====

export const getVideoLayerId = videoName => videoName + '-video'


ctx.react(
  'updateVideoLayer',
  [videos.videos.HOT],
  (ctx, vs) => {
    Object.keys(vs).forEach(n => {
      const v = vs[n], name = getId(n)
      renderer.updateLayer(ctx, name, {asset: v, flipY: true})
    })
  }
)


export const sceneLayerId = val('scene')


ctx.react(
  'updateSceneLayer',
  [sceneLayerId.HOT, videos.names.HOT],
  (id, ground, videoNames, view, projection) => {

    renderer.updateLayer(ctx, id, {
      objects: videoNames.map(getScreenId)
      .concat([ground])
      .concat(videoNames.map(getPedestalId)),
      uniforms: {
        view,
        projection,
        withDistance: 0,
        groundHeight: 0
      }
    })
  }
)
ground: 'H objects.ground.id',
view: 'C camera.view',
projection: 'C camera.perspective' },

  'id': {val: 'mirror-scene'},

  'update': {
    stream: {
      with: {
        id: 'H #id',
        ctx: 'H renderer.context',
        videoNames: 'H videos.names',
        getScreenId: 'H objects.screens.getId',
        getPedestalId: 'H objects.pedestals.getId',
        groundPosition: 'H objects.ground.position',
        view: 'C camera.groundMirrorView',
        projection: 'C camera.perspective' },

      do: ({ctx, groundPosition, videoNames, id, getScreenId, getPedestalId, view, projection}) => {

        renderer.updateLayer(ctx, id, {
          flipY: true,
          objects: videoNames.map(getScreenId)
            .concat(videoNames.map(getPedestalId)),
          uniforms: {
            view,
            projection,
            withDistance: 1,
            groundHeight: groundPosition[1]
          }
        }) } } } }


  'update': {
    stream: {
      with: {
        ids: 'H #ids',
        ctx: 'H renderer.context',
        shader: 'H shaders.groundReflection.id',
        size: 'H renderer.canvasSize' },

      do: ({ctx, ids, size, shader}) => {

        size = [size.width, size.height]

        ids.forEach((id, i) => {
          renderer.updateLayer(ctx, id, {
            shader,
            uniforms: {
              size,
              direction: i % 2,
              strength: ids.length - i
            }
          })
        })

      } } } }


// ===== Rendering =====

export const layers = stream(
  [
    'H layers.scene.id',
    'H layers.groundReflection.ids',
    'H layers.mirrorScene.id'
  ],
  (scene, reflections, mirrorScene) =>
    [mirrorScene].concat(reflections).concat([scene])
)


export const render = stream(
  [ctx.COLD, layers.COLD, tick.HOT],
  renderer.renderLayers
)


addToFlow({
  render
}, 'renderer')
