import {val, addToFlow} from '../../flow'

import vert from './base-vert.glsl'
import frag from './base-frag.glsl'


export const id = val('base-shader')


export const spec = val({
  vert, frag,
  attribs: {
    position: "f 3",
    uv: "f 2",
  },
  uniforms: {
    image: 't',
    color: 'f 3',
    connections: 'f 4',
    transform: "m 4",
    projection: "m 4",
    view: "m 4"
  }
})


addToFlow({ id, spec }, 'view.shaders.base')


if (module.hot) {
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].view.shaders.base.reset()
  })
}
