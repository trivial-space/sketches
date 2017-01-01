import {val, addToFlow} from '../../flow'
import assets from 'tvs-renderer/lib/asset-lib'
import frag from './ground-reflection-frag.glsl'


export const id = val('ground-reflection-shader')


export const spec = val({
  ...assets.shaders.basicEffect,
  frag,
  uniforms: {
    size: 'f 2',
    source: 't',
    direction: 'i',
    strength: 'f'
  }
})


addToFlow({id, spec}, 'view.shaders.groundReflection')


if (module.hot) {
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].view.shaders.groundReflection.reset()
  })
}
