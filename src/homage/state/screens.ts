import {val, stream, addToFlow} from '../flow'
import {mat4} from 'tvs-libs/lib/math/gl-matrix'
import * as coords from 'tvs-libs/lib/math/coords'
import * as videos from '../videos'


export const radius = val(25)

export const height = val(2)

export const scale = val([1.6, 1, 1])


export const rotations = stream(
  [videos.names.HOT],
  videoNames => videoNames.reduce((rs, n, i) => {
    rs[n] = Math.PI * 2 * i / videoNames.length
    return rs
  }, {})
)


export const positions = stream(
  [radius.HOT, rotations.HOT, height.HOT, videos.names.HOT],
  (radius, rotations, height, videoNames) =>
    videoNames.reduce((ps, n) => {
      const phi = -rotations[n] - Math.PI / 2
      const [x, z] = coords.polarToCartesian2D([radius, phi])
      ps[n] = [x, height, z]
      return ps
    }, {})
)


export const transforms = stream(
  [rotations.HOT, positions.HOT, scale.HOT, videos.names.HOT],
  (rotations, positions, scale, videoNames) =>
  videoNames.reduce((ts, n) => {
    const t = mat4.fromTranslation(mat4.create(), positions[n])
    mat4.rotateY(t, t, rotations[n])
    mat4.scale(t, t, scale)
    ts[n] = t
    return ts
  }, {})
)


addToFlow({
  radius, height, scale, rotations, positions, transforms
}, 'state.screens')
