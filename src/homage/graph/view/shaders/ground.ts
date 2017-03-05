import {val} from 'homage/flow'
import vert from './ground-vert.glsl'
import frag from './ground-frag.glsl'



export const id = val('ground-shader')


export const spec = val({
  vert, frag,
  attribs: {
    position: "f 3"
  },
  uniforms: {
    transform: "m 4",
    projection: "m 4",
    view: "m 4",
    reflection: "t",
    size: 'f 2'
  }
})


if (module.hot) {
  requestAnimationFrame(function() {
    window['entities'] && window['entities'].view.shaders.ground.reset()
  })
}
