import { mat4 } from 'gl-matrix'
import * as coords from 'tvs-libs/dist/lib/math/coords'
import * as videos from './videos'
import { zip } from 'tvs-libs/dist/lib/utils/sequence'


const radius = 25

const height = 2

export const scale = [1.6, 1, 1]


export const rotations = videos.names.map((_, i) => Math.PI * 2 * i / videos.names.length)


export const positions = rotations.map(rot => {
	const phi = -rot - Math.PI / 2
	const [x, z] = coords.polarToCartesian2D([radius, phi])
	return [x, height, z]
})


export const transforms = zip((rot, pos) => {
	const t = mat4.fromTranslation(mat4.create(), pos)
	mat4.rotateY(t, t, rot)
	mat4.scale(t, t, scale)
	return t
}, rotations, positions)
