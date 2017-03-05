import {val, stream} from 'homage/flow'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import * as geo from 'tvs-libs/lib/math/geometry'


export const position = val([0, -3.4, 0])

export const normal = val([0, 1, 0])

export const scale = val(10)


export const transform = val(mat4.create())
  .react(
    [position.HOT, scale.HOT],
    (mat, pos, scale) => {
      mat4.fromTranslation(mat, pos)
      mat4.rotateX(mat, mat, Math.PI / 2)
      return mat4.scale(mat, mat, [scale, scale, scale])
    }
  )


export const planeEquation = stream(
  [normal.HOT, position.HOT],
  geo.planeFromNormalAndCoplanarPoint
)


export const mirrorMatrix = stream(
  [planeEquation.HOT],
  geo.mirrorMatrixFromPlane
)
