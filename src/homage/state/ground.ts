import { mat4 } from 'gl-matrix'
import * as geo from 'tvs-libs/dist/lib/math/geometry'


export const position = [0, -1.6, 0]

const normal = [0, 1, 0]

const scale = 10


export const transform = mat4.create()

mat4.fromTranslation(transform, position)
mat4.rotateX(transform, transform, Math.PI / 2)
mat4.scale(transform, transform, [scale, scale, scale])


const planeEquation = geo.planeFromNormalAndCoplanarPoint(normal, position)

export const mirrorMatrix = geo.mirrorMatrixFromPlane(planeEquation)
