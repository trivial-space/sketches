import { getContext } from 'tvs-painter/dist/lib/utils/context'
import { Painter } from 'tvs-painter/dist/lib/painter'
import { State } from './types'


export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const gl = getContext(canvas)

export const painter = new Painter(gl)

export const state = {} as State

window['state'] = state
