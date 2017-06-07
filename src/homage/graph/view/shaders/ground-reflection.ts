import {val} from 'homage/flow'
import assets from 'tvs-renderer/lib/asset-lib'
import frag from './ground-reflection-frag.glsl'
import { ShaderData } from "tvs-renderer/lib";


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
} as ShaderData)


if (module.hot) {
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].view.shaders['ground-reflection'].reset()
  })
}
