import * as flow from '../flow'
import context from './context'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import {makePerspective} from 'tvs-libs/lib/vr/flow-camera'

const {val, addToFlow} = flow


const camera = makePerspective(flow, context.canvasSize)
export const {aspect, perspective} = camera

camera.fovy.val(Math.PI * 0.5)


export const distance = val(103)


export const view = val(mat4.create())
  .react(
    [aspect.HOT, distance.HOT],
    (m, aspect, dist) => {
      mat4.fromTranslation(m, [0, 0, dist / aspect])
      mat4.invert(m, m)
      return m
    }
  )


  addToFlow({
    ...camera,
    distance,
    view,
  }, 'view.camera')
