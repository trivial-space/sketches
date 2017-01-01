import {val, addToFlow} from '../../flow'
import vert from './screen-vert.glsl'
import frag from './screen-frag.glsl'


export const id = val('screen-shader')


export const spec = val({
  vert, frag,
  attribs: {
    position: "f 3",
    uv: "f 2"
  },
  uniforms: {
    video: "t",
    transform: "m 4",
    projection: "m 4",
    view: "m 4",
    withDistance: "i",
    groundHeight: 'f'
  }
})


addToFlow({id, spec}, 'view.shaders.screen')


if (module.hot) {
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].view.shaders.screen.reset()
  })
}
