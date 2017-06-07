import {val, stream} from 'homage/flow'
import * as renderer from 'tvs-renderer/lib/renderer'
import {context, canvasSize} from './context'
import {tick, slowTick} from '../events'
import * as boxGeo from './geometries/box'
import * as planeGeo from './geometries/plane'
import * as videos from '../videos'
import * as camera from './camera'
import * as groundShader from './shaders/ground'
import * as groundReflectionShader from './shaders/ground-reflection'
import * as objectShader from './shaders/object'
import * as screenShader from './shaders/screen'
import * as ground from '../state/ground'
import * as screens from '../state/screens'
import * as pedestals from '../state/pedestals'
import * as reflectionEffect from './effects/ground-reflection'

const ctx = context


// ===== rendering settings =====

export const settings = val({
  clearColor: [0, 0, 0, 1],
  minFilter: 'LINEAR',
  magFilter: 'LINEAR'
})


ctx.react(
  [settings.HOT],
  renderer.updateSettings
)


// ===== Geometries =====

ctx.react(
  [boxGeo.id.HOT, boxGeo.geometry.HOT],
  renderer.updateGeometry
)


ctx.react(
  [planeGeo.id.HOT, planeGeo.geometry.HOT],
  renderer.updateGeometry
)


// ===== Shaders =====

ctx.react(
  [groundReflectionShader.id.HOT, groundReflectionShader.spec.HOT],
  renderer.updateShader
)

ctx.react(
  [groundShader.id.HOT, groundShader.spec.HOT],
  renderer.updateShader
)

ctx.react(
  [objectShader.id.HOT, objectShader.spec.HOT],
  renderer.updateShader
)

ctx.react(
  [screenShader.id.HOT, screenShader.spec.HOT],
  renderer.updateShader
)


// ===== Objects =====

export const groundId = val('ground')

ctx.react(
  [
    groundId.HOT,
    groundShader.id.HOT,
    planeGeo.id.HOT,
    ground.transform.HOT,
    canvasSize.HOT,
  ],
  (ctx, id, shaderId, geoId, transform, size) =>

    renderer.updateObject(ctx, id, {
      shader: shaderId,
      geometry: geoId,
      uniforms: {
        transform,
        size: [size.width, size.height]
      }
    })
)


const getScreenId = screenName => screenName + '-screen'

ctx.react(
  [screenShader.id.HOT, planeGeo.id.HOT, screens.transforms.HOT, videos.names.HOT],
  (ctx, shaderId, geometryId, transforms, videoNames) => {
    videoNames.forEach(n => {
      renderer.updateObject(ctx, getScreenId(n), {
          shader: shaderId,
          geometry: geometryId,
          uniforms: {
            transform: transforms[n],
            video: getVideoLayerId(n)
          }
      })
    })

    return ctx
  }
)


export const getPedestalId = screenName => screenName + '-pedestal'

ctx.react(
  [objectShader.id.HOT, boxGeo.id.HOT, videos.names.HOT, pedestals.transforms.HOT],
  (ctx, shaderId, geometryId, videoNames, transforms) => {

    videoNames.forEach(n => {
      renderer.updateObject(ctx, getPedestalId(n), {
        shader: shaderId,
        geometry: geometryId,
        uniforms: {
          transform: transforms[n]
        }
      })
    })

    return ctx
  }
)


// ===== Layers =====

export const getVideoLayerId = videoName => videoName + '-video'

ctx.react(
  [videos.videos.HOT, slowTick.HOT],
  (ctx, vs) => {

    Object.keys(vs).forEach(n => {
      const v = vs[n], name = getVideoLayerId(n)
      renderer.updateLayer(ctx, name, {asset: v, flipY: true})
    })

    return ctx
  }
)


export const sceneLayerId = val('scene')

ctx.react(
  [
    sceneLayerId.HOT,
    videos.names.HOT,
    groundId.HOT,
    camera.view.COLD,
    camera.perspective.COLD
  ],
  (ctx, id, videoNames, ground, view, projection) =>

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
)


export const mirrorSceneLayerId = val('mirror-scene')

ctx.react(
  [
    mirrorSceneLayerId.HOT,
    ground.position.HOT,
    videos.names.HOT,
    camera.groundMirrorView.COLD,
    camera.perspective.COLD
  ],
  (ctx, id, groundPosition, videoNames, view, projection) =>

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
    })
)


// ===== effects =====

ctx.react(
  [
    reflectionEffect.ids.HOT,
    reflectionEffect.layersData.HOT,
    groundReflectionShader.id.HOT,
    canvasSize.HOT
  ],
  (ctx, ids, layerData, shaderId, size) => {

    ids.forEach((id, i) => {
      renderer.updateLayer(ctx, id, {
        shader: shaderId,
        uniforms: {
          ...layerData[i],
          size: [size.width, size.height]
        }
      })
    })

    return ctx
  }
)



// ===== Rendering =====

export const layers = stream(
  [sceneLayerId.HOT, reflectionEffect.ids.HOT, mirrorSceneLayerId.HOT],
  (scene, reflections, mirrorScene) =>

    [mirrorScene].concat(reflections).concat([scene])
)


export const render = stream(
  [ctx.COLD, layers.COLD, tick.HOT],
  renderer.renderLayers
)
