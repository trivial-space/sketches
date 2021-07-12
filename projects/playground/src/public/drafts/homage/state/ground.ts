import { mat4, vec3 } from 'gl-matrix'
import * as geo from 'tvs-libs/dist/math/geometry'

export const position: vec3 = [0, -3.6, 0]
const normal = [0, 1, 0]
const scale = 1000

export const transform = mat4.create()
export const groundMirrorView = mat4.create()

mat4.fromTranslation(transform, position)
mat4.rotateX(transform, transform, Math.PI / 2)
mat4.scale(transform, transform, [scale, scale, scale])

export const planeEquation = geo.planeFromNormalAndCoplanarPoint(
	normal,
	position,
)

export const mirrorMatrix = geo.mirrorMatrixFromPlane(planeEquation)
