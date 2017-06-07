import {val, stream} from 'homage/flow'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import * as vec from 'tvs-libs/lib/math/vectors'
import * as screens from './screens'
import * as videos from '../videos'
import { GLMat } from "gl-matrix";


export const scale = val([1.65, 1, 1])


export const transforms = stream(
  [screens.rotations.HOT, screens.positions.HOT, scale.HOT, videos.names.HOT],
  (rotations, positions, scale, videoNames) =>

    videoNames.reduce((ts, n) => {
      const pos = vec.mul(positions[n], 1.045)
      pos[1] -= 1.9

      const t = mat4.fromTranslation(mat4.create(), pos)
      mat4.rotateY(t, t, rotations[n])
      mat4.scale(t, t, scale)
      ts[n] = t
      return ts
    }, {} as {[id: string]: GLMat})
)
