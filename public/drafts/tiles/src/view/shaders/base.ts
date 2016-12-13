import {entity, addToFlow} from '../../flow'
import vert from './base-vert.glsl!text'
import frag from './base-frag.glsl!text'

export const id = entity('base-shader')


export const spec = entity({
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


export function __reload() {
  window['entities'] && window['entities'].view.shaders.base.reset()
}
