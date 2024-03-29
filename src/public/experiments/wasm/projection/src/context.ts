import { getPainterContext } from '../../../../../shared-utils/app/painterState'
import { screenSizeRandomTextureGenerator } from '../../../../../shared-utils/texture/utils'

export const canvas = document.getElementById('canvas') as HTMLCanvasElement
export const Q = getPainterContext(canvas)
export const getRndTex = screenSizeRandomTextureGenerator()
