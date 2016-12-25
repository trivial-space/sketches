import {entity, addToFlow} from '../../flow'
import {renderer} from 'tvs-renderer'


export const id = entity('ground-reflection-shader')

export const frag = entity<string>(require('./ground-reflection-frag.glsl'))

export const update = entity()
  .stream({
    with: {
      id: 'H #id',
      ctx: 'H renderer.context',
      frag: 'H #frag'
    },
    do: ({id, ctx, frag}) => {
      renderer.updateShader(ctx, id, Object.assign({}, renderer.lib.shaders.basicEffect, {
        frag,
        uniforms: {
          size: 'f 2',
          source: 't',
          direction: 'i',
          strength: 'f'
        }
      }))
    }
  })


flow.addGraph(toGraph(spec, 'shaders.groundReflection'))
console.log('adding graph: shaders.groundReflection')


if (module.hot) {
  console.log('reseting shaders.groundReflection')
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].shaders.groundReflection.reset()
  })
}
