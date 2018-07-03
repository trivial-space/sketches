import { getContext } from 'tvs-painter/dist/lib/utils/context'
import { Painter } from 'tvs-painter/dist/lib/painter'


export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const gl = getContext(canvas)

export const painter = new Painter(gl)
