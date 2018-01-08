import { val, stream } from 'tvs-flow/dist/lib/utils/entity-reference'
import { normalRand } from 'tvs-libs/dist/lib/math/random'
import { extrudeBottom } from 'tvs-libs/dist/lib/geometry/quad'
import { normal } from 'tvs-libs/dist/lib/geometry/primitives'
import { tick } from 'tiles/graph/events'
import { mat4 } from 'gl-matrix'


export const tileSize = val(10)

export const color = val([normalRand(), normalRand(), normalRand()])

export const quad = val(extrudeBottom([0, -2, 0], [[-1, 1, 0], [1, 1, 0]]))

export const faceNormal = stream([quad.HOT], q => normal(q))

export const rotation = val(0)
.react(
	[tick.HOT],
	(s, tpf) => s + tpf * 0.01
)

export const transform = stream(
	[tileSize.HOT],
	size => mat4.fromScaling(mat4.create(), [size, size, size])
)
.react(
	[rotation.HOT],
	(s, rot) => mat4.rotateY(s, s, rot)
)
