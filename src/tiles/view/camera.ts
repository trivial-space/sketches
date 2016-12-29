import {val, addToFlow} from '../flow'
import context from './context'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
// import {MouseState} from 'tvs-libs/lib/events/mouse'



export const fovy = val(Math.PI * 0.5)
export const near = val(0.1)
export const far = val(1000)

export const distance = val(103)

export const aspect = val(1)
  .react(
    [context.canvasSize.HOT],
    (self, size) => size ? size.width / size.height : self
  )


export const view = val(mat4.create())
  .react(
    [aspect.HOT, distance.HOT],
    (m, aspect, dist) => {
      mat4.fromTranslation(m, [0, 0, dist / aspect])
      mat4.invert(m, m)
      return m
    }
  )


export const perspective = val(mat4.create())
  .react(
    'updatePosition',
    [
      fovy.HOT,
      aspect.HOT,
      near.HOT,
      far.HOT
    ],
    mat4.perspective
  )


  addToFlow({
    fovy,
    near,
    far,
    distance,
    aspect,
    view,
    perspective
  }, 'view.camera')
