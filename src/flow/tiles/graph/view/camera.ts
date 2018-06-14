import { canvasSize } from './context'
import { mat4 } from 'gl-matrix'
import { makePerspective } from 'tvs-utils/dist/lib/vr/flow-camera'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'


export const { perspectiveSettings, perspective } = makePerspective(canvasSize)


perspectiveSettings.updateVal(s => ({ ...s, fovy: Math.PI * 0.5 }))


export const distance = val(103)


export const view = val(mat4.create())
  .react(
    [perspectiveSettings.HOT, distance.HOT],
    (m, settings, dist) => {
      mat4.fromTranslation(m, [0, 0, dist / settings.aspect])
      mat4.invert(m, m)
      return m
    }
  )
