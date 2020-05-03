import { Vec } from 'tvs-libs/dist/math/vectors'

export interface LineSegment {
	vertices: Vec[]
	normals: Vec[]
	fragments: number[]
}

export interface LineStep {
	distance: number
}

export type LineWalk = LineStep[]

export function lineSegmentToForm(segment: LineSegment) {}
