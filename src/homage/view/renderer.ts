import {entity, addToFlow} from 'flow'
import {renderer} from 'tvs-renderer'
import ctx from './context'


export const settings = entity({
  clearColor: [0, 0, 0, 1],
  minFilter: 'LINEAR',
  magFilter: 'LINEAR'
})


export const updateSettings = entity()
  .stream({
    with: {
      ctx: ctx.context.HOT,
      settings: settings.HOT
    },
    do: ({ctx, settings}) => renderer.updateSettings(ctx, settings)
  })


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
