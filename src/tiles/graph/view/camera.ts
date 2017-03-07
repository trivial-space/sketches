import {canvasSize} from './context'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import { makePerspective } from 'tvs-libs/lib/vr/flow-camera'
import { val } from "tiles/flow";


export const { fovy, aspect, near, far, perspective } = makePerspective(canvasSize)


fovy.val(Math.PI * 0.5)


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
