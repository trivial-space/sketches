import {entity, SELF, addToFlow} from '../flow'
import context from './context'
import {mat4} from 'gl-matrix'
// import {MouseState} from 'tvs-libs/lib/events/mouse'


export const fovy = entity(Math.PI * 0.5)
export const near = entity(0.1)
export const far = entity(1000)

export const distance = entity(103)

export const aspect = entity(1)
  .stream({
    with: {
      size: context.canvasSize.HOT,
    },
    do: ({size}) => size.width / size.height
  })


export const view = entity(mat4.create())
  .stream({
    with: {
      m: SELF,
      aspect: aspect.HOT,
      dist: distance.HOT
    },
    do: ({m, dist, aspect}) => {
      mat4.fromTranslation(m, [0, 0, dist / aspect])
      mat4.invert(m, m)
      return m
    }
  })


export const perspective = entity(mat4.create())
  .stream({
    id: 'updatePosition',
    with: {
      m: SELF,
      near: near.HOT,
      far: far.HOT,
      fovy: fovy.HOT,
      aspect: aspect.HOT
    },
    do: ({m, near, far, fovy, aspect}) => mat4.perspective(m, fovy, aspect, near, far)
  })


  addToFlow({
    fovy,
    near,
    far,
    distance,
    aspect,
    view,
    perspective
  }, 'view.camera')
