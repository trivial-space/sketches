import { stream, val } from 'tvs-flow/dist/lib/utils/entity-reference'
import { FormData } from 'tvs-painter/dist/lib'
import { nodes, nameSpaceCount, connections } from '../state/nodes'
import { mapcat, flatten } from 'tvs-libs/dist/lib/utils/sequence'
import { intToFloat } from 'tvs-libs/dist/lib/graphics/colors'
import { sub, normalize, add, mul } from 'tvs-libs/dist/lib/math/vectors'



export const points = stream(
	[nodes.HOT, nameSpaceCount.HOT],
	(nodes, nsCount) => ({
		drawType: 'POINTS',
		attribs: {
			position: {
				buffer: new Float32Array(mapcat(nodes, n => n.pos)),
				storeType: 'DYNAMIC'
			},
			color: {
				buffer: new Float32Array(mapcat(nodes, n => intToFloat([
					(n.ns / nsCount) * 255,
					(((n.ns / nsCount) + (1 / 3)) * 255) % 255,
					(((n.ns / nsCount) + (2 / 3)) * 255) % 255
				]))),
				storeType: 'DYNAMIC'
			}
		},
		itemCount: nodes.length
	} as FormData)
)


export const lineWidth = val(3)


export const lines = stream(
	[connections.HOT, nodes.HOT, lineWidth.HOT],
	(connections, nodes, width) => ({
		drawType: 'TRIANGLES',
		attribs: {
			position: {
				buffer: new Float32Array(mapcat(connections, c => {
					const n1 = nodes[c[0]]
					const n2 = nodes[c[1]]
					const vDiff = normalize(sub(n2.pos, n1.pos))
					const normal = [vDiff[1], -vDiff[0]]
					const p1 = add(n1.pos, mul(normal, width / 2))
					const p2 = add(n1.pos, mul(normal, -width / 2))
					const p3 = add(n2.pos, mul(normal, width / 2))
					const p4 = add(n2.pos, mul(normal, -width / 2))
					return flatten([p1, p2, p3, p2, p3, p4])
				})),
				storeType: 'DYNAMIC'
			}
		},
		itemCount: connections.length * 6
	} as FormData)
)
