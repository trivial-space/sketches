import {val, addToFlow} from '../../flow'
import vert from './object-vert.glsl'
import frag from './object-frag.glsl'


export const id = val('object-shader')


export const spec = val({
  vert, frag,
  attribs: {
    position: "f 3"
  },
  uniforms: {
    transform: "m 4",
    projection: "m 4",
    view: "m 4",
    withDistance: "i",
    groundHeight: 'f'
  }
})


addToFlow({id, spec}, 'view.shaders.object')


if (module.hot) {
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].view.shaders.object.reset()
  })
}
