import lvert from './shaders/line.vert'
import lfrag from './shaders/line.frag'
import pvert from './shaders/point.vert'
import pfrag from './shaders/point.frag'
import { val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { ShadeData } from 'tvs-painter/dist/lib'

export const line = val({
	vert: lvert,
	frag: lfrag
} as ShadeData).reset()

export const point = val({
	vert: pvert,
	frag: pfrag
} as ShadeData).reset()
