import { getContext } from 'tvs-painter/dist/lib/utils/context'
import { create } from 'tvs-painter/dist/lib/painter'
import { State } from './types'


export const canvas = document.getElementById('canvas') as HTMLCanvasElement

export const gl = getContext(canvas)

export const painter = create(gl)

export const state = {} as State

window['state'] = state
